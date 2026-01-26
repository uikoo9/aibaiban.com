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

        // 获取现有元素
        const existingElements = excalidrawAPI.current.getSceneElements()

        // 添加新元素到白板
        excalidrawAPI.current.updateScene({
          elements: [
            ...existingElements,
            ...newElements,
          ],
        })

        console.log('✅ 图表已添加到白板')

        // 可选：滚动到新内容（延迟执行，等待渲染完成）
        setTimeout(() => {
          if (excalidrawAPI.current) {
            // 获取新元素的边界，滚动到可视区域
            excalidrawAPI.current.scrollToContent(newElements, {
              fitToViewport: false,
              animate: true,
            })
          }
        }, 100)
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

