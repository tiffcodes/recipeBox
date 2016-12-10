import React from 'react';
import ReactDom from 'react-dom';
import { Route, Router, Link, browserHistory, IndexRoute } from 'react-router';
import Fuse from 'fuse.js';

// components:
import SignUp from './signUp.js';
import SignIn from './signIn.js';
import Header from './header.js';
import Footer from './footer.js';
import NotFound from './notFound.js';
import AddRecipe from './addRecipe.js';
import Recipes from './recipes.js';
import Alphabet from './alphabet.js';
import NoRecipesFound from './NoRecipesFound';


class App extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			loggedIn: false,
			recipe: [], 
			filteredRecipes: [], 
			showFiltered: false
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

		firebase.database().ref('recipe').on('value', (res) => {
			const data = res.val();
			const recipe = [];
			for(let key in data) {
				data[key].key = key;
				recipe.push(data[key]);
			}
			this.setState({recipe});
		});
	}
	removeRecipe(recipeToRemove) {
		firebase.database().ref(`recipe/${recipeToRemove.key}`).remove();
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

	handleSearch(e) {
		let options = {
			shouldSort: true,
			threshold: 0.3,
			location: 0,
			distance: 100,
			minMatchCharLength: 1,
			keys: [
				"title",
				"ingredients"
			]
		};
		let searchQuery = e.target.value;

		let list = this.state.recipe;
		let fuse = new Fuse(list, options); 
		let result = fuse.search(searchQuery);
		
		if (searchQuery.length > 0) {
			this.setState({
				filteredRecipes: result,
				showFiltered: true
			});
		} else {
			this.setState({
				showFiltered: false
			});
		}

	}

	renderRecipes() {
		const recipeRender = (recipes) => {
			return <Recipes recipe={recipes} removeRecipe={this.removeRecipe}/>
		};
		if(this.state.showFiltered) {
			if(this.state.filteredRecipes.length === 0) {
				return <NoRecipesFound />
			}
			return recipeRender(this.state.filteredRecipes);
		}
		else {
			return recipeRender(this.state.recipe);
		}
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
								<input placeholder="Search" ref={ref => this.search = ref} onChange={e => this.handleSearch.call(this,e)}/>
							</p>
						</div>
						<AddRecipe /> 
						<section>
							<h3>Recipes:</h3>
							<Alphabet />
							{this.renderRecipes()}
						</section>
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

