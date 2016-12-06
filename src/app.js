import React from 'react';
import ReactDom from 'react-dom';
import { Route, Router, Link, browserHistory, IndexRoute } from 'react-router';

let Fuse = require('fuse.js');

// components:
import SignUp from './signUp.js';
import SignIn from './signIn.js';
import Footer from './footer.js';
import NotFound from './notFound.js';
import AddRecipe from './addRecipe.js';
import Header from './header.js';
import Recipes from './recipes.js';


class App extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			loggedIn: false,
			search: ''
		}

		let config = {
		  apiKey: "AIzaSyBvMwXsV0jsyGOy2laI6mUPdSo4irwT9hI",
		  authDomain: "my-project-734e0.firebaseapp.com",
		  databaseURL: "https://my-project-734e0.firebaseio.com",
		  storageBucket: "my-project-734e0.appspot.com",
		  messagingSenderId: "712734743751"
		};
		firebase.initializeApp(config);
	}	

	componentDidMount() {
		firebase.auth()
			.onAuthStateChanged((res) => {
				if(res) {
					console.log('logged In? ', res.Xb);
					this.setState({
						loggedIn: true
					});
				}
		});
	}

	signout(e) {
		e.preventDefault();
		firebase.auth().signOut().then(() => {
		  	// Sign-out successful change state to not logged in:
			this.setState({
				loggedIn: false
			});
			this.context.router.push('/');
		}, function(error) {
			console.log(error);
		});
	}


	render() {
		let main;
		if (this.state.loggedIn) {
			main =  <div>
						<div className="menu">
							<p>
								<a href="#" onClick={e => this.signout.call(this,e)}>Sign out</a>
							</p>
							<p>
								<a href="#addrecipe">Add Recipe</a>
							</p>
							<p>
								<input placeholder="Search" onChange={e => this.handleSearch.call(this,e)}/>
							</p>
						</div>
						<AddRecipe /> 
						<Recipes />
					</div>;

		} else {
			main =  <div>
						<SignIn />
						<SignUp />
					</div>;
		}
		return (
			<div className="clearfix app">
				<Header />
				<div className="wrapper">
					{main}
				</div>
				<Footer/>
			</div>
		);
	}
}

App.contextTypes = {
	router: React.PropTypes.object
};

ReactDom.render(
	<Router history={browserHistory}>
		<Route path="/" component={App} />
		<Route path="/addrecipes" component={AddRecipe} />
		<Route path="/recipes" component={Recipes} />
		<Route path="*" component={NotFound} />
	</Router>, document.getElementById('app'));

