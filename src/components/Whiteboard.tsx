import { useState, useEffect, useCallback, useRef } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'

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

export function Whiteboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [initialData, setInitialData] = useState<any>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 加载保存的数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setInitialData(parsed)
      } catch (error) {
        console.error('Failed to load saved whiteboard data:', error)
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
}

