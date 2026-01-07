const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.B7WLu3AD.js",app:"_app/immutable/entry/app.CAlNfYjB.js",imports:["_app/immutable/entry/start.B7WLu3AD.js","_app/immutable/chunks/CPeuV09b.js","_app/immutable/chunks/CwXWRgzM.js","_app/immutable/chunks/BJgUTw8A.js","_app/immutable/entry/app.CAlNfYjB.js","_app/immutable/chunks/CwXWRgzM.js","_app/immutable/chunks/iwWP6nog.js","_app/immutable/chunks/BL7B2s9I.js","_app/immutable/chunks/BJgUTw8A.js","_app/immutable/chunks/DP_-XnFu.js","_app/immutable/chunks/D7WO8EVL.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-C4W-uRn5.js')),
			__memo(() => import('./chunks/1-DW6ZzLQN.js')),
			__memo(() => import('./chunks/2-B4sdtx3S.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
