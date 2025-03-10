import { KNode } from '@/model'
import { Extension } from '../Extension'
import './style.less'

declare module '../../model' {
  interface EditorCommandsType {
    /**
     * 设置分隔线
     */
    setHorizontal?: () => Promise<void>
  }
}

export const HorizontalExtension = () =>
  Extension.create({
    name: 'horizontal',
    extraKeepTags: ['hr'],
    domParseNodeCallback(node) {
      if (node.isMatch({ tag: 'hr' })) {
        node.type = 'closed'
      }
      return node
    },
    formatRules: [
      ({ node }) => {
        if (node.isMatch({ tag: 'hr' })) {
          node.type = 'closed'
        }
      }
    ],
    addCommands() {
      const setHorizontal = async () => {
        const node = KNode.create({
          type: 'closed',
          tag: 'hr'
        })
        this.insertNode(node)
        await this.updateView()
      }

      return {
        setHorizontal
      }
    }
  })
