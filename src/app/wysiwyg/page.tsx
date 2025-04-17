"use client";

import React from 'react';
import WysiwygEditor from '@/components/WysiwygEditor';

// localStorageのキー
const EDITOR_CONTENT_KEY = 'wysiwyg-editor-content';

/**
 * WYSIWYGエディター（What You See Is What You Get）のページ
 * リッチテキストエディターでゲームのメモを記録できる
 */
export default function WysiwygPage() {
  return (
    <WysiwygEditor
      storageKey={EDITOR_CONTENT_KEY}
      placeholder="Write your game notes here..."
      fullScreen={true}
    />
  );
}
