import { Provider } from "react-redux";
import "./Global.scss";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./views/MiniGame";
import rootStore from "./store";

function App() {
	try {
		(window as any).js_invoke
			? (window as any).js_invoke.changeOrientation(1)
			: (window as any).webkit.messageHandlers.changeOrientation.postMessage(
					1
			  );
	} catch {}

	return (
		<Provider store={rootStore}>
			<Router>
				<Switch>
					<Route path="/">
						<Main />
					</Route>
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
