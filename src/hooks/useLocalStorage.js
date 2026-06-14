import { useState, useEffect } from 'react'

// Lưu state vào localStorage để ghi chú / tiến độ không mất khi tải lại.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* bỏ qua khi localStorage không khả dụng */
    }
  }, [key, value])

  return [value, setValue]
}
