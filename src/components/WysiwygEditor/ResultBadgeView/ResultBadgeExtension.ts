import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResultBadgeView from ".";

/**
 * WIN/LOSEバッジを表示するためのTipTap拡張機能
 */
const ResultBadgeExtension = Node.create({
  name: "resultBadge",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      result: {
        default: "WIN",
        parseHTML: (element) => element.getAttribute("data-result"),
        renderHTML: (attributes) => {
          return {
            "data-result": attributes.result,
            "data-type": "result-badge",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="result-badge"]',
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

  renderHTML({ HTMLAttributes }) {
    return ["span", { "data-type": "result-badge", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResultBadgeView);
  },
});

export default ResultBadgeExtension;
