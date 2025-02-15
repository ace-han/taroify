import { createContext } from "react"
import { PopupPlacement } from "./popup.shared"

interface PopupContextProps {
  open?: boolean
  placement?: PopupPlacement

  onClose?(opened: boolean): void
}

const PopupContext = createContext<PopupContextProps>({})
export default PopupContext
