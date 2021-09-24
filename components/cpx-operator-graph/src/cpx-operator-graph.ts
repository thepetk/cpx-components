import cytoscape from "https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.19.1/cytoscape.esm.min.js";
import { compareSemVer } from 'https://cdn.skypack.dev/semver-parser';

function versionSelector(strings, csv, versions, all) {
  return `<tr>
    <td><input name="${csv.packageName}" type="radio" id="${csv.version}" /></td>
    <td><label for="${csv.version}">${csv.version}</label>
      <!--<ul>
        ${csv.replaces ? `<li>Replaces: ${csv.replaces}</li>`:''}
        ${csv.skips ? `<li>Skips: ${csv.skips}</li>`:''}
        <li>Channel: ${csv.channelName}</li>
      </ul>-->
    </td>
    <td></td>
    ${all || true ? `<td>
      <ul>
        <li>${[...versions]}</li>
      </ul>
    </td>`:''}
  </tr>`;
}

/*
Operator Graph

{
    "csvName": "advanced-cluster-management.v2.1.0",
    "packageName": "advanced-cluster-management",
    "channelName": "release-2.1",
    "bundlePath": "registry.redhat.io/rhacm2/acm-operator-bundle@sha256:76435cfe5728bbcacabb1a444ca45df913a7d5a8541b0cc40496cd11d77865db",
    "providedApis": [
      {
        "group": "operator.open-cluster-management.io",
        "version": "v1",
        "kind": "ClusterManager",
        "plural": "clustermanagers"
      }
    ],
    "version": "2.1.0",
    "skipRange": "\u003e=2.0.0 \u003c2.1.0",
    "properties": [
      {
        "type": "olm.gvk",
        "value": "{\"group\":\"app.k8s.io\",\"kind\":\"Application\",\"version\":\"v1beta1\"}"
      }
    ]
  }

*/

function setCurve(edge) {
  const edgeVerticalLength = edge.source().renderedPosition('x') - edge.target().renderedPosition('x');
  const decreaseFactor = -0.1; 
  const controlPointDistance = edgeVerticalLength * decreaseFactor;
  const controlPointDistances = [controlPointDistance, -1 * controlPointDistance];
  edge.data('controlPointDistances', controlPointDistances.join(' '));
}

class OperatorVersion {}
class OperatorPackage {}
class OperatorChannel {}


class OperatorBundle {
  versions = new Set();
  channels
  getVersions() {}
  getChannels() {}
}

// Chapeaux Branch Component: cpx-branch
export class CPXOperatorGraph extends HTMLElement {
  static get tag() {
    return "cpx-operator-graph";
  }
  template;
  cy;
  _url = "";
  get url() {
    return this._url;
  }
  set url(val) {
    if (this._url === val) return;
    this._url = val;
    this.setAttribute("url", this._url);
    fetch(val).then((resp) => {
      return resp.text()
    }).then((data) => {
      this.data = data.replaceAll("}\n{", "}|||{").split("|||").map((c) =>
        JSON.parse(c)
      );
    });
  }

  _data: any;
  get data() {
    return this._data;
  }
  set data(val) {
    if (this._data === val) return;
    this._data = val;
    this.render();
  }

  _filter = "";
  get filter() {
    return this._filter;
  }
  set filter(val) {
    if (this._filter === val) return;
    this._filter = val;
    this.render();
  }

  _query = "";
  get query() {
    return this._query;
  }
  set query(val) {
    if (this._query === val) return;
    this._query = val;
  }

  _sort = "";
  get sort() {
    return this._sort;
  }
  set sort(val) {
    if (this._sort === val) return;
    this._sort = val;
  }

  _order = "asc";
  get order() {
    return this._order;
  }
  set order(val: string) {
    if (this._order === val) return;
    this._order = val;
  }

  _channel = "";
  get channel() {
    return this._channel;
  }
  set channel(val) {
    if (this._channel === val) return;
    this._channel = val;
    this.setAttribute('channel',this._channel);
    this.render();
  }

  _channels = new Map<string,any>();
  get channels() {
    return this._channels;
  }
  set channels(val) {
    if (this._channels === val) return;
    this._channels = val;
  }

  _versions = new Map<string,Set<string>>();
  get versions() {
    return this._versions;
  }
  set versions(val) {
    if (this._versions === val) return;
    this._versions = val;
  }

  constructor(url: string) {
    super();
    this.attachShadow({ mode: "open" });
    this.template = this.querySelector("template").cloneNode(true);
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    this.addEventListener('pfe-select:change', evt=>this.channel=evt['detail'].value);
  }

  static get observedAttributes() {
    return ["url", "filter", "query", "sort", "order", "group", "channel"];
  }

  attributeChangedCallback(name: string, oldVal, newVal: any) {
    this[name] = newVal;
  }

  render(all?:boolean) {
    /*
        Template Parsing
        data-key = in the scope, place the data[key] in any delimiter
        data-repeat = iterate over the scoped item
        data-group = iterate and group on key
    */
    if (this.data && this.filter !== "" && this.query !== "") {
      const filteredData = this._data.filter((d) => d[this.filter] === this.query);
      filteredData.map(csv=> {
        // 
        if (!this.versions.has(csv.version)) {
          let csvVersion = this.versions.get(csv.version);
          if (!csvVersion.has(csv.channelName)) {
            this.versions.set(csv.version)
          }
          this.versions.set(csv.version, csvVersion );
        } else {
          this.versions.set(csv.version, [csv.channelName])
        }
        if (this.channels.has(csv.channelName)) {
          let channelInfo = this.channels.get(csv.channelName);
          channelInfo.push(csv);
          this.channels.set(csv.channelName, channelInfo);
        } else {
          this.channels.set(csv.channelName, [csv]);
        }
      });
      this.channels.forEach((versions,channel,d)=> {
        d.set(channel,versions.sort((a, b) => {
          const ord = { desc: 1, asc: -1 };
          return compareSemVer(b['version'], a['version']) * ord[this.order];
        }));
      });
    }
    if (this.channels.size > 0) {
      this.template = this.querySelector("template").cloneNode(true);
      const channelSelect = this.template.content.querySelector('#channels');
      [...this.channels.keys()].forEach(channel => {
        const opt = document.createElement('option');
        opt.innerHTML = channel;
        opt.setAttribute('value',channel);
        if (this.channel === channel) { opt.setAttribute('selected', 'selected'); }
        channelSelect.appendChild(opt);
      });

      // Set version rows
      // if (!all) {
        const versionsNode = this.template.content.querySelector('[data-repeat="versions"]');
        this.channels.get(this.channel).forEach(csv=>{
          versionsNode.innerHTML += versionSelector`${csv}${this.versions}${all}`;
        });
        const graphImg = versionsNode.querySelector('tr td:nth-child(3)');
        graphImg.id = 'graph';
        graphImg.setAttribute('rowspan', [...this.channels.get(this.channel)].length.toString());
        graphImg.innerHTML = '<div id="cy"></div>';
      // }

      while (this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
      }
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));

      // https://js.cytoscape.org/
      this.cy = cytoscape({
        container: this.shadowRoot.querySelector("#cy"),
        elements: [...this.channels.get(this.channel)].reduce((a,csv)=>{
          a = a.concat([{ data: { id: csv.csvName }}]);
          if (csv.replaces) {
            a = a.concat([{ data: { 
              id: csv.csvName+'replace', 
              source: csv.replaces, 
              target: csv.csvName,
              controlPointDistances: '0  0'
              } 
            }]);
          }
          return a;
        },[]),
        zoomingEnabled: false,
        panningEnabled: false,
        boxSelectionEnabled: false,
        autoungrabify: true,
        style: [ // the stylesheet for the graph
          {
            selector: "node",
            style: {
              "width": 25,
              "height": 25,
              "background-color": "#fff",
              "border-width": 3,
              "border-color": "#00F",
              //"label": "data(id)",
            },
          },

          {
            selector: "edge",
            style: {
              "width": 3,
              "line-color": "#00F",
              "curve-style": "unbundled-bezier", 
              'control-point-weights': '0.1 0.2 0.5 0.8 0.9',
              'control-point-distances': '30 40 40 40 30'
              // 'control-point-distances': 'data(controlPointDistances)'
            }
          },
        ],

        layout: {
          name: "grid",
          columns: 1,
        },
      });

      // this.cy.edges().forEach(edge=>setCurve(edge));
    }
  }
}
window.customElements.define(CPXOperatorGraph.tag, CPXOperatorGraph);