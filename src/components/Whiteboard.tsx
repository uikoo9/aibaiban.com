import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import type { SimplifiedDiagram } from '@/types/diagram'
import { convertDiagramToExcalidraw } from '@/utils/diagramConverter'

// 深色主题列表
const DARK_THEMES = [
  'dark',
  'synthwave',
  'halloween',
  'forest',
  'aqua',
  'lofi',
  'black',
  'luxury',
  'dracula',
  'business',
  'night',
  'coffee',
  'dim',
]

const STORAGE_KEY_PREFIX = 'excalidraw-data'

/**
 * 元素分组类型
 */
interface ElementGroup {
  type: 'node' | 'connection'  // 节点（形状+文字）或连线（箭头+标签）
  y: number  // 用于排序的 y 坐标
  x: number  // 用于排序的 x 坐标
  elements: any[]  // 该组包含的所有元素
}

/**
 * 将元素分组并按位置排序（从上到下，从左到右）
 * - 节点：形状 + 其绑定的文字作为一组
 * - 连线：箭头/线 + 其关联的标签文字作为一组
 */
function groupAndSortElements(elements: any[]): ElementGroup[] {
  const groups: ElementGroup[] = []
  const processedIds = new Set<string>()

  // 第1步：识别节点组（形状 + 绑定的文字）
  elements.forEach((element) => {
    if (processedIds.has(element.id)) return

    // 如果是形状元素（rectangle, ellipse, diamond）
    if (['rectangle', 'ellipse', 'diamond'].includes(element.type)) {
      const groupElements = [element]
      processedIds.add(element.id)

      // 查找绑定到该形状的文字
      if (element.boundElements) {
        element.boundElements.forEach((bound: any) => {
          if (bound.type === 'text') {
            const textElement = elements.find((el) => el.id === bound.id)
            if (textElement) {
              groupElements.push(textElement)
              processedIds.add(textElement.id)
            }
          }
        })
      }

      groups.push({
        type: 'node',
        y: element.y,
        x: element.x,
        elements: groupElements,
      })
    }
  })

  // 第2步：识别连线组（箭头/线 + 标签文字）
  elements.forEach((element) => {
    if (processedIds.has(element.id)) return

    // 如果是连线元素（arrow, line）
    if (['arrow', 'line'].includes(element.type)) {
      const groupElements = [element]
      processedIds.add(element.id)

      // 查找紧邻的文字标签（独立文字，containerId 为 null）
      // 标签通常在连线附近，通过位置判断
      const labelCandidates = elements.filter(
        (el) =>
          !processedIds.has(el.id) &&
          el.type === 'text' &&
          el.containerId === null &&
          Math.abs(el.x - element.x) < 200 &&
          Math.abs(el.y - element.y) < 200
      )

      // 取最近的一个作为标签
      if (labelCandidates.length > 0) {
        const closestLabel = labelCandidates[0]
        groupElements.push(closestLabel)
        processedIds.add(closestLabel.id)
      }

      groups.push({
        type: 'connection',
        y: element.y,
        x: element.x,
        elements: groupElements,
      })
    }
  })

  // 第3步：处理剩余未分组的元素（独立文字等）
  elements.forEach((element) => {
    if (!processedIds.has(element.id)) {
      groups.push({
        type: element.type === 'text' ? 'node' : 'connection',
        y: element.y,
        x: element.x,
        elements: [element],
      })
      processedIds.add(element.id)
    }
  })

  // 第4步：排序（主要按 y 坐标，次要按 x 坐标）
  groups.sort((a, b) => {
    if (Math.abs(a.y - b.y) < 50) {
      // y 坐标相近（同一行），按 x 坐标排序（从左到右）
      return a.x - b.x
    }
    // 否则按 y 坐标排序（从上到下）
    return a.y - b.y
  })

  return groups
}

// 暴露的方法接口
export interface WhiteboardHandle {
  addRandomShape: () => void
  addAIGeneratedDiagram: (diagram: SimplifiedDiagram) => void
  clearWhiteboard: () => void
}

interface WhiteboardProps {
  userId?: string // 用户ID，用于区分不同用户的数据
}

export const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(({ userId }, ref) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [initialData, setInitialData] = useState<any>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const excalidrawAPI = useRef<any>(null)

  // 打印userId变化
  useEffect(() => {
    console.log('[Whiteboard] userId changed:', userId)
  }, [userId])

  // 获取存储key（根据用户ID）
  const getStorageKey = useCallback(() => {
    const key = userId ? `${STORAGE_KEY_PREFIX}-${userId}` : `${STORAGE_KEY_PREFIX}-anonymous`
    console.log('[Whiteboard] Storage key:', key, 'userId:', userId)
    return key
  }, [userId])

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    addRandomShape: () => {
      if (!excalidrawAPI.current) return

      const shapes = ['rectangle', 'ellipse', 'diamond'] as const
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9']

      const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      const randomX = Math.random() * 800
      const randomY = Math.random() * 600
      const randomWidth = 100 + Math.random() * 150
      const randomHeight = 100 + Math.random() * 150

      const newElement = {
        id: `shape-${Date.now()}-${Math.random()}`,
        type: randomShape,
        x: randomX,
        y: randomY,
        width: randomWidth,
        height: randomHeight,
        angle: 0,
        strokeColor: randomColor,
        backgroundColor: randomColor + '40',
        fillStyle: 'solid',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: randomShape === 'rectangle' ? { type: 3 } : null,
        seed: Math.floor(Math.random() * 2147483647),
        version: 1,
        versionNonce: Math.floor(Math.random() * 2147483647),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
      }

      excalidrawAPI.current.updateScene({
        elements: [
          ...excalidrawAPI.current.getSceneElements(),
          newElement as any,
        ],
      })
    },
    addAIGeneratedDiagram: (diagram: SimplifiedDiagram) => {
      if (!excalidrawAPI.current) return

      try {
        // 转换简化格式为 Excalidraw 格式
        const newElements = convertDiagramToExcalidraw(diagram)
        console.log('转换后的元素数量:', newElements.length)
        console.log('元素类型分布:', newElements.reduce((acc, el) => {
          acc[el.type] = (acc[el.type] || 0) + 1
          return acc
        }, {} as Record<string, number>))

        // ⭐ 将元素分组（节点+文字，连线+标签）并按位置排序
        const elementGroups = groupAndSortElements(newElements)
        console.log(`✨ 开始渐进式渲染，共 ${elementGroups.length} 组元素`)

        // ⭐ 渐进式渲染：每 200ms 渲染一组
        let currentIndex = 0
        const renderInterval = setInterval(() => {
          if (currentIndex >= elementGroups.length) {
            clearInterval(renderInterval)
            console.log('✅ 渐进式渲染完成')

            // 渲染完成后，滚动到新内容
            setTimeout(() => {
              if (excalidrawAPI.current) {
                excalidrawAPI.current.scrollToContent(newElements, {
                  fitToViewport: false,
                  animate: true,
                })
              }
            }, 100)
            return
          }

          // 添加当前组的元素
          const currentGroup = elementGroups[currentIndex]
          excalidrawAPI.current.updateScene({
            elements: [
              ...excalidrawAPI.current.getSceneElements(),
              ...currentGroup.elements,
            ],
          })

          console.log(`📦 渲染第 ${currentIndex + 1}/${elementGroups.length} 组 (${currentGroup.type})`)
          currentIndex++
        }, 200) // 每 200ms 渲染一组
      } catch (error) {
        console.error('Failed to add AI generated diagram:', error)
      }
    },
    clearWhiteboard: () => {
      if (!excalidrawAPI.current) return

      // 只清空白板显示，不删除localStorage中的数据
      excalidrawAPI.current.updateScene({
        elements: [],
      })

      console.log('✅ 白板已清空（仅清空显示）')
    },
  }), [getStorageKey])

  // 加载保存的数据（根据用户ID）
  useEffect(() => {
    const storageKey = getStorageKey()
    const savedData = localStorage.getItem(storageKey)
    console.log('[Whiteboard] Loading data from:', storageKey, 'found:', !!savedData)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // 验证并过滤掉无效的元素
        if (parsed.elements && Array.isArray(parsed.elements)) {
          const validElements = parsed.elements.filter((el: any) => {
            // 确保元素有必需的字段
            return (
              el.id &&
              el.type &&
              typeof el.x === 'number' &&
              typeof el.y === 'number' &&
              typeof el.width === 'number' &&
              typeof el.height === 'number'
            )
          })
          const dataToLoad = {
            ...parsed,
            elements: validElements,
          }
          console.log('[Whiteboard] Loading data, elements count:', validElements.length, 'API ready:', !!excalidrawAPI.current)
          setInitialData(dataToLoad)
          // 如果Excalidraw API已经初始化，直接更新场景
          if (excalidrawAPI.current) {
            excalidrawAPI.current.updateScene(dataToLoad)
            console.log('[Whiteboard] Updated scene via API')
          }
        } else {
          console.log('[Whiteboard] Loading data (no validation)')
          setInitialData(parsed)
          if (excalidrawAPI.current) {
            excalidrawAPI.current.updateScene(parsed)
            console.log('[Whiteboard] Updated scene via API')
          }
        }
      } catch (error) {
        console.error('Failed to load saved whiteboard data:', error)
        // 清除损坏的数据
        localStorage.removeItem(storageKey)
      }
    } else {
      // 如果没有保存的数据，设置为空数据
      console.log('[Whiteboard] No saved data, using empty data')
      const emptyData = { elements: [], appState: {} }
      setInitialData(emptyData)
      // 如果Excalidraw API已经初始化，也要清空场景
      if (excalidrawAPI.current) {
        excalidrawAPI.current.updateScene(emptyData)
        console.log('[Whiteboard] Cleared scene via API')
      }
    }
  }, [getStorageKey])

  // 检测主题
  useEffect(() => {
    const detectTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      const isDark = DARK_THEMES.includes(currentTheme)
      setTheme(isDark ? 'dark' : 'light')
    }

    detectTheme()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          detectTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  // 保存数据（正确的防抖实现，根据用户ID）
  const handleChange = useCallback((elements: readonly any[], appState: any) => {
    // 清除之前的 timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // 设置新的 timeout
    saveTimeoutRef.current = setTimeout(() => {
      const storageKey = getStorageKey()
      const dataToSave = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          // 只保存必要的状态
        },
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      console.log('[Whiteboard] Saved data to:', storageKey, 'elements count:', elements.length)
    }, 1000)
  }, [getStorageKey])

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // 修复 Excalidraw 按钮的无障碍问题
  useEffect(() => {
    const addAriaLabels = () => {
      // 为主菜单按钮添加 aria-label
      const mainMenuButton = document.querySelector('[data-testid="main-menu-trigger"]')
      if (mainMenuButton && !mainMenuButton.getAttribute('aria-label')) {
        mainMenuButton.setAttribute('aria-label', '主菜单')
      }

      // 为其他没有 aria-label 的按钮添加
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
      buttons.forEach((button) => {
        const testId = button.getAttribute('data-testid')
        const title = button.getAttribute('title')

        if (testId === 'main-menu-trigger') {
          button.setAttribute('aria-label', '主菜单')
        } else if (title) {
          button.setAttribute('aria-label', title)
        }
      })
    }

    // 初始化时添加
    const timer = setTimeout(addAriaLabels, 1000)

    // 监听 DOM 变化，动态添加
    const observer = new MutationObserver(() => {
      addAriaLabels()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="w-full h-full">
      <Excalidraw
        excalidrawAPI={(api) => (excalidrawAPI.current = api)}
        theme={theme}
        langCode="zh-CN"
        initialData={
          initialData || {
            appState: {
              viewBackgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            },
          }
        }
        onChange={handleChange}
      />
    </div>
  )
})

