import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react'
import LandingPage from './LandingPage';
import League from './League'
import Features from './Features';
import Register from './Register';
import Profile from './Profile';
import Player from './Player';
import Team from './Team';

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
							path="/league"
							render={() => (
								<League />
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
						<Route
							exact
							path="/team"
							render={() => (
								<Team />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}

}

