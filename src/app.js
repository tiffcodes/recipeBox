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
import NoRecipesFound from './noRecipesFound';


class App extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			loggedIn: false,
			recipe: [], 
			filteredRecipes: [], 
			showFiltered: false,
			globalRecipes: [],
			viewGlobal: false,
			searchVisible: false, 
			showInfo: false
		}

		let config = {
			apiKey: "AIzaSyBvMwXsV0jsyGOy2laI6mUPdSo4irwT9hI",
			authDomain: "my-project-734e0.firebaseapp.com",
			databaseURL: "https://my-project-734e0.firebaseio.com",
			storageBucket: "my-project-734e0.appspot.com",
			messagingSenderId: "712734743751"
		};
		firebase.initializeApp(config);
		let currentUser = '';
	}	
	
	componentDidMount() {
		firebase.auth()
			.onAuthStateChanged((user) => {
				if(user) {
					this.currentUser = user.uid;
					// console.log('logged In? ', user.Xb);
					this.setState({
						loggedIn: true
					});
					this.loadUserRecipes();
					this.loadGlobalRecipes();
				}
		});
	}

	componentDidUpdate() {
	  if(this.state.searchVisible)
	    this.search.focus();
	}

	loadUserRecipes() {
		// console.log('currentUser:', this.currentUser);
		firebase.database().ref(`${this.currentUser}/recipe`).on('value', (res) => {
				const data = res.val();
				const recipe = [];
				for(let key in data) {
					data[key].key = key;
					recipe.push(data[key]);
				}
				this.setState({recipe});
			})
	}

	loadGlobalRecipes() {
		firebase.database().ref('recipe').on('value', (res) => {
 			const data = res.val();
 			const allRecipes = [];
 			for(let key in data) {
 				data[key].key = key;
 				allRecipes.push(data[key]);
 			}
 			// console.log('allRecipes', allRecipes);
 			this.setState({globalRecipes : allRecipes})
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
			console.log('error: ', error);
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
			document.getElementById('recipeList').scrollIntoView();
		} else {
			this.setState({
				showFiltered: false
			});
		}

	}

	renderRecipes(recipes) {
		// console.log('calling the render function');
		return (
			<div>
				<Alphabet isGlobal={this.state.viewGlobal} />
				<Recipes recipe={recipes} allUsersRecipes={this.state.recipe} currentUser={this.currentUser} isGlobal={this.state.viewGlobal} />
				
			</div>
		)
	}

	getRecipes() {
		if(this.state.showFiltered) {
			if(this.state.filteredRecipes.length === 0) {
				return <NoRecipesFound />
			}
			return this.renderRecipes(this.state.filteredRecipes);
		}
		else if (this.state.viewGlobal) {
			return this.renderRecipes(this.state.globalRecipes);
		}
		else {
			return this.renderRecipes(this.state.recipe);
		}
	}

	viewPublic() {
		this.setState({
			viewGlobal: true
		});
		document.getElementById('recipeList').scrollIntoView();
	}

	viewPrivate() {
		this.setState({
			viewGlobal: false
		});
		document.getElementById('recipeList').scrollIntoView();
	}

	toggleGlobal() {
		if(this.state.viewGlobal) {
			this.setState({
				viewGlobal: false
			});
		} else {
			this.setState({
				viewGlobal: true
			});
		}
	}
	shouldFocus() {
		document.getElementById('search').focus();
	}
	showSearch() {
		if(this.state.searchVisible) {
			this.setState({
				searchVisible: false
			});
		} else {
			this.setState({
				searchVisible: true
			});
			this.shouldFocus();
		}
	}

	addRecipe() {
		if (!this.state.viewGlobal) {
			return <AddRecipe currentUser={this.currentUser} />
		}
	}
	addRecipeClickHandler() {
		this.setState({
			viewGlobal: false
		})
	}
	showInfoHandler() {
		if (this.state.showInfo === true) {
			this.setState({
				showInfo: false
			})
		} else {
			this.setState({
				showInfo: true
			})
		}
	}
	showInfo() {
		if (this.state.showInfo === true) {
			return (
				<div className='moreInfo'>
					<h2>Welcome to Recipe Box!</h2>
					<p><strong>'My Recipes'</strong> is a place for you to save and share recipes. 'My Recipes' list is private to only you! The <strong>'Public'</strong> recipe list is a shared recipe list for everyone that uses Recipe Box. You can add your own recipes to the <strong>'Public'</strong> recipe list by clicking the share button on the recipe card in 'My Recipes' list. You can save public recipes to your personal recipe list by clicking the 'save' button on the public recipe card.</p>
				</div>
			)
		} 
	}

	render() {
		let main;
		if (this.state.loggedIn) {
			main =  <div className="clearfix">
						<div className="search clearfix">
							<input 
							id="search"
							className={this.state.searchVisible ? 'visible' : 'notVisible'} 
							placeholder="Search for recipes or ingredients" 
							ref={ref => this.search = ref} 
							onChange={e => this.handleSearch.call(this,e)} />
							<i 
							className="fa fa-search" 
							onClick={e => this.showSearch.call(this,e)}></i>
						</div>
						<div className="info" onClick={e => this.showInfoHandler.call(this, e)}>
							<i className="fa fa-question"></i>
							{this.showInfo()}
						</div>
						<div className="clearfix">
							
							{this.addRecipe()}
						
							<section className="recipeSection">
								{this.getRecipes()}
							</section>
							<aside className="menu">
								<div className="wrapper">
									<p>
										<button onClick={e => this.signout.call(this,e)}>
											<i className="fa fa-hand-peace-o"></i>
											<span>Sign out</span>
										</button>
									</p>
									<p className={this.state.viewGlobal ? 'nonactive' : 'active'}>
										<button onClick={e => this.viewPrivate.call(this,e)}>
											<i className="fa fa-user"></i>
											<span>My Recipes</span>
										</button>
									</p>
									<p className={this.state.viewGlobal ? 'active' : 'nonactive'}>
											<button onClick={e => this.viewPublic.call(this,e)}>
											<i className="fa fa-users"></i>
											<span>Public</span>
										</button>
									</p>
									<p className="addrec" onClick={e => this.addRecipeClickHandler.call(this, e)}>
										<a href="#addrecipe">
											<i className="fa fa-plus"></i>
											<span>Add</span>
										</a>
									</p>
								</div>
							</aside>
						</div>
					</div>

		} else {
			main =  <div>
						<SignIn />
						<SignUp />
					</div>
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
		<Route path="*" component={NotFound} />
	</Router>, document.getElementById('app'));

// import images and docs? maybe hidden on click, but the upload is normal
// add conversion widget 
// sticky alphabet once you scroll into recipes 
// add notifications and feedback to the top like readme does with the blue bar
