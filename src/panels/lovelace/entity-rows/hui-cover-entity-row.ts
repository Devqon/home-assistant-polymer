import { html, LitElement, PropertyDeclarations } from "@polymer/lit-element";
import { TemplateResult } from "lit-html";

import "../components/hui-generic-entity-row.js";
import "../../../components/ha-cover-controls.js";
import "../../../components/ha-cover-tilt-controls.js";

import { isTiltOnly } from "../../../util/cover-model.js";
import { HomeAssistant } from "../../../types.js";
import { EntityRow, EntityConfig } from "./types.js";

class HuiCoverEntityRow extends LitElement implements EntityRow {
  public hass?: HomeAssistant;
  private _config?: EntityConfig;

  static get properties(): PropertyDeclarations {
    return {
      hass: {},
      _config: {},
    };
  }

  public setConfig(config: EntityConfig): void {
    if (!config) {
      throw new Error("Configuration error");
    }
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-error-entity-row
          .entity=${this._config.entity}
        ></hui-error-entity-row>`;
    }

    return html`
      ${this.renderStyle()}
      <hui-generic-entity-row
        .hass=${this.hass}
        .config=${this._config}
      >
      ${
        isTiltOnly(stateObj)
          ? html`
            <ha-cover-tilt-controls
              .hass=${this.hass}
              .stateObj=${stateObj}
            ></ha-cover-tilt-controls>`
          : html`
            <ha-cover-controls
              .hass=${this.hass}
              .stateObj=${stateObj}
            ></ha-cover-controls>`
      }
      </hui-generic-entity-row>
    `;
  }

  private renderStyle(): TemplateResult {
    return html`
      <style>
        ha-cover-controls,
        ha-cover-tilt-controls {
          margin-right: -.57em;
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-cover-entity-row": HuiCoverEntityRow;
  }
}

customElements.define("hui-cover-entity-row", HuiCoverEntityRow);