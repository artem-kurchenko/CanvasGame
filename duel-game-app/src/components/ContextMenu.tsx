import { memo, useEffect, useRef } from "react";
import "./ContextMenu.css";
import { menuColors } from "../data";

interface ContextMenuProps {
    menuPosition: { x: number, y: number };
    showMenu: boolean;
    menuClickHandler: Function;
    setShowMenu: Function;
}

const ContextMenu = memo(({ menuPosition, showMenu, setShowMenu, menuClickHandler }: ContextMenuProps) => {

    const menuRef = useRef<HTMLUListElement>(null);

    const handleClick = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
            {showMenu && (
                <ul
                    ref={menuRef} 
                    className="context-menu"
                    style={{
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`
                    }}
                >
                    {menuColors.map((item, _) => <li className="context-menu-item" key={item.id} onClick={() => menuClickHandler(item.color)}>{item.color}</li>)}
                </ul>
            )}
        </>
    );
})

export default ContextMenu;
