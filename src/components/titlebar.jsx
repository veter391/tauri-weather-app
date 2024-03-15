
import "./titlebar.scss";
import { appWindow } from '@tauri-apps/api/window'

function Titlebar() {
    return (
        <div data-tauri-drag-region className="titlebar">
            <button onClick={() => appWindow.minimize()} className="titlebar-button" id="titlebar-minimize">
                <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
            </button>
            <button onClick={() => appWindow.toggleMaximize()} className="titlebar-button" id="titlebar-maximize">
                <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
            </button>
            <button onClick={() => appWindow.close()} className="titlebar-button" id="titlebar-close">
                <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
            </button>
        </div>
    );
}

export default Titlebar;
