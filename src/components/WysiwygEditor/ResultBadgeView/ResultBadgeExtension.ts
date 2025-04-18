import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResultBadgeView from ".";

/**
 * WIN/LOSEバッジを表示するためのTipTap拡張機能
 * 
 * このエクステンションは、エディタ内にゲーム結果を示す特殊なノードを挿入します。
 * バッジはインライン要素として動作し、ユーザーはテキスト中に勝敗情報を視覚的に表現できます。
 * 
 * 機能：
 * - エディタ内で選択、ドラッグ可能なインラインノード
 * - WIN/LOSE状態の保存と表示
 * - カスタムReactコンポーネントを使用したレンダリング
 */
const ResultBadgeExtension = Node.create({
  // ノードの名前（一意の識別子）
  name: "resultBadge",
  
  // ノードのグループ（インライン要素として配置できる）
  group: "inline",
  
  // インライン要素として機能
  inline: true,
  
  // ユーザーが選択可能
  selectable: true,
  
  // ドラッグ＆ドロップで移動可能
  draggable: true,

  /**
   * ノードの属性を定義
   * ここではWIN/LOSEの結果情報を保持する属性を追加
   */
  addAttributes() {
    return {
      result: {
        // デフォルト値
        default: "WIN",
        
        // HTMLから属性を解析する方法
        parseHTML: (element) => element.getAttribute("data-result"),
        
        // 属性をHTMLとしてレンダリングする方法
        renderHTML: (attributes) => {
          return {
            "data-result": attributes.result,
            "data-type": "result-badge",
          };
        },
      },
    };
  },

  /**
   * HTML解析ルールを定義
   * これにより、エディタ内容の保存/復元時に正しく解析できる
   */
  parseHTML() {
    return [
      {
        // data-type="result-badge"属性を持つspanタグを検索
        tag: 'span[data-type="result-badge"]',
        
        // 要素から属性を抽出
        getAttrs: (element) => {
          if (typeof element === "string") {
            return false;
          }
          return {
            result: element.getAttribute("data-result") || "WIN",
          };
        },
      },
    ];
  },

  /**
   * ノードをHTMLとしてレンダリングする方法を定義
   * エディタ内でのHTML表現を制御
   */
  renderHTML({ HTMLAttributes }) {
    return ["span", { "data-type": "result-badge", ...HTMLAttributes }];
  },

  /**
   * カスタムReactコンポーネントを使用したノードビューを追加
   * これにより、バッジの視覚的な表現を制御できる
   */
  addNodeView() {
    return ReactNodeViewRenderer(ResultBadgeView);
  },
});

export default ResultBadgeExtension;
