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

const STORAGE_KEY = 'excalidraw-data'

// 暴露的方法接口
export interface WhiteboardHandle {
  addRandomShape: () => void
  addAIGeneratedDiagram: (diagram: SimplifiedDiagram) => void
}

export const Whiteboard = forwardRef<WhiteboardHandle>((_props, ref) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [initialData, setInitialData] = useState<any>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const excalidrawAPI = useRef<any>(null)

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

        // 添加到白板
        excalidrawAPI.current.updateScene({
          elements: [
            ...excalidrawAPI.current.getSceneElements(),
            ...newElements,
          ],
        })

        // 可选：滚动到新内容
        // excalidrawAPI.current.scrollToContent(newElements)
      } catch (error) {
        console.error('Failed to add AI generated diagram:', error)
      }
    },
  }), [])

  // 加载保存的数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
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
          setInitialData({
            ...parsed,
            elements: validElements,
          })
        } else {
          setInitialData(parsed)
        }
      } catch (error) {
        console.error('Failed to load saved whiteboard data:', error)
        // 清除损坏的数据
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

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

  // 保存数据（正确的防抖实现）
  const handleChange = useCallback((elements: readonly any[], appState: any) => {
    // 清除之前的 timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // 设置新的 timeout
    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          // 只保存必要的状态
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }, 1000)
  }, [])

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

