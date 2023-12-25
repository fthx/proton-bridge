//    Proton Bridge Button
//    GNOME Shell extension
//    @fthx 2023


import GObject from 'gi://GObject';
import Shell from 'gi://Shell';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';


const ProtonBridgeButton = GObject.registerClass(
class ProtonBridgeButton extends PanelMenu.Button {
    _init() {
        super._init();

        this._box = new St.BoxLayout({reactive: true, style_class: 'panel-button'});
        this._icon = new St.Icon({style_class: 'system-status-icon'});

        this._box.add_child(this._icon);
        this.add_child(this._box);
    }
});

export default class ProtonBridgeButtonExtension {
    _get_app() {
        this._app = Shell.AppSystem.get_default().lookup_app('ch.proton.bridge-gui.desktop');
        if (!this._app) {
            Main.notify('Extension warning: Proton Bridge app not found');
            return;
        }

        this._icon = this._app.get_icon();
        this._button._icon.set_gicon(this._app.get_icon());
    }

    _on_clicked() {
        if (this._app.get_n_windows() > 0) {
            this._app.request_quit();
        } else {
            this._app.activate();
        }
    }

    enable() {
        this._button = new ProtonBridgeButton();
        this._get_app();
        Main.panel.addToStatusArea('Proton Bridge button', this._button);

        this._button.connectObject('button-release-event', this._on_clicked.bind(this), this);
    }

    disable() {
        if (this._app) {
            this._app.disconnectObject(this);
        }
        this._app = null;
        this._window = null;
        this._icon = null;

        this._button.disconnectObject(this);
        this._button.destroy();
        this._button = null;
    }
}
