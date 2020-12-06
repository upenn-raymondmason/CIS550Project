import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react'
import LandingPage from './LandingPage';
import About from './About'
import Features from './Features';
import Register from './Register';
import Profile from './Profile';
import Player from './Player';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		}
		this.handleUserChange = this.handleUserChange.bind(this);
	}

	handleUserChange(username) {
		this.setState({username: username});
	}

	render() {
		return (
			<div data-testid="main" id="main" className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<LandingPage />
							)}
						/>
						<Route
							exact
							path="/about"
							render={() => (
								<About />
							)}
						/>
						<Route
							exact
							path="/features"
							render={() => (
								<Features />
							)}
						/>
						<Route
							exact
							path="/register"
							render={() => (
								<Register />
							)}
						/>
						<Route
							exact
							path="/profile"
							render={() => (
								<Profile username = {this.state.username} />
							)}
						/>
						<Route
							exact
							path="/player"
							render={() => (
								<Player />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}

}

