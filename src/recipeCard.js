import React from 'react';

export default class RecipeCard extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			publicRecipeSaved: false, 
			privateRecipeDownloaded: false,
			recipeShared: false
		}
	}	

	componentDidMount() {
		// Private view state handling:
		if (this.props.isGlobal) {
			this.setState({
				recipeShared: false
			})
		} else if (this.props.recipe.userId === undefined ) {
			this.setState({
				recipeShared: false
			})
		} else if (this.props.recipe.userId !== this.props.currentUser) {
			this.setState({
				privateRecipeDownloaded: true
			})
		} else if (this.props.recipe.userId === this.props.currentUser) {
			this.setState({
				privateRecipeDownloaded: false,
				recipeShared: true
			})
		}
		// Global/public view state handlers:
		if (this.props.isGlobal) {
			const allUsersRecipes = this.props.allUsersRecipes;
			var filtered = allUsersRecipes.filter((recipe) => {
				recipe.ingredients.map((ingredient) => {
					if (this.props.recipe.ingredients.indexOf(ingredient) === -1) {
						return;
					}
				}) 
				return (this.props.recipe.title === recipe.title 
						&& this.props.recipe.totalTime === recipe.totalTime
						&& this.props.recipe.serves === recipe.serves
						&& this.props.recipe.prepTime === recipe.prepTime);
			})
			console.log('length and name',this.props.recipe.title, filtered.length)
			if (filtered.length > 0) {
				this.setState({
					publicRecipeSaved: true
				})
			}
		}
	}

	removeRecipe(recipeToRemove) {
		if (confirm('Are you sure you want to delete this recipe')) { 
		  firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToRemove.key}`).remove();
		  alert('Note: deleting this recipe does not automatically delete the public recipe');
		}
	}

	removeGlobalRecipe(recipeToRemove) {
		if (confirm('Are you sure you want to delete this recipe')) { 
		 firebase.database().ref(`recipe/${recipeToRemove.key}`).remove();

		 // delete the userId on the private version of the recipe here
		  alert('Note: deleting this public recipe does not automatically delete your private recipe');
		}
		
	}

	saveToMyRecipes(recipeToSave) {
		firebase.database().ref(`recipe/${recipeToSave.key}`).on('value',  (res) => {
			const data = res.val();
			// save to firebase db private list:
			firebase.database().ref(`${this.props.currentUser}/recipe`).push(data);
			this.setState({
				publicRecipeSaved: true
			})
		});
	}

	shareRecipe(recipeToShare) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).on('value',  (res) => {
			const data = res.val();
			// add user id to the recipe object
			data['userId'] = this.props.currentUser;
			// add user id to original private recipe:
			firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).set(data);
			console.log('first done');
		});

		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).on('value',  (res) => {
			const data = res.val();
			// add user id to the recipe object
			data['userId'] = this.props.currentUser;
			// save to firebase db in public recipes:
			firebase.database().ref('recipe').push(data);
			// set state to show recipe is shared:
			this.setState({
				recipeShared: true
			})
		});
	}

	getRemoveButton(){
		if (this.props.isGlobal && 
			this.props.recipe.userId === this.props.currentUser) {
			
			return <i className="fa fa-times upperLeft" onClick={(e) => this.removeGlobalRecipe.call(this, this.props.recipe)}></i>

		} else if (this.props.isGlobal === false) {
			return <i className="fa fa-times upperLeft" onClick={(e) => this.removeRecipe.call(this, this.props.recipe)}></i>
		}
	}

	getSaveRecipeButton() {
		if (this.props.isGlobal && 
			this.props.recipe.userId === this.props.currentUser) {
			return  <div className="upperRight clearfix">
						<p className="textHint">My Recipe</p>
						<i className="fa-user fa"></i>
					</div>

		} else if(this.props.isGlobal && 
			this.state.publicRecipeSaved === false ) {
			return  <div className="upperRight clearfix clickable">
						<p className="textHint">Save</p>
						<i className="fa fa-star-o" onClick={(e) => this.saveToMyRecipes.call(this, this.props.recipe)}></i>
					</div>

		} else if (this.props.isGlobal && 
			this.state.publicRecipeSaved === true ) {
			return  <div className="upperRight clearfix">
						<p className="textHint">Saved</p>
						<i className="fa fa-star"></i>
					</div>

		} 
	}

	getShareRecipeButton() {
		if (this.props.isGlobal === false 
			&& this.state.privateRecipeDownloaded) {
			return (
				<div className="upperRight clearfix">
					<p className="textHint">Saved</p>
					<i className="fa fa-bookmark green"></i>
				</div> )

		} else if (this.props.isGlobal === false  
			&& this.state.recipeShared === false ) {

			return ( 
				<div className="upperRight clearfix clickable">
					<p className="textHint">Share</p>
					<i className="fa fa-share-alt" onClick={(e) => this.shareRecipe.call(this, this.props.recipe)}></i>
				</div> )

		} else if (this.props.isGlobal === false 
			&& this.state.recipeShared ){
			
			return (
				<div className="upperRight clearfix">
					<p className="textHint">Shared</p>
					<i className="fa fa-share-alt green"></i>
				</div> )

		} 
	}

	render() {
		return (
			<div className="recipe" id={this.props.checkAlphabet(this.props.firstLetter, this.props.alphabet)} >
				{this.getRemoveButton()}
				{this.getSaveRecipeButton()}
				{this.getShareRecipeButton()}
				
				<h2 id={this.props.recipe.title}>{this.props.recipe.title}</h2>
				<p>Prep Time: {this.props.recipe.prepTime}</p>
				<p>Total Time: {this.props.recipe.totalTime}</p>
				<p>Ingredients:</p>
				<ul>

					{ (() => {
						if(this.props.recipe.ingredients !== "") {
							return this.props.recipe.ingredients.map((recipeIngred, i) => {
									return (
										<li key={i}>{recipeIngred}</li>
									)
								});
							}

						})()
					}
				</ul>
				<p>Instructions:</p>
				<ol>
					{ (() => {
						if(this.props.recipe.instructions !== "") {
							return this.props.recipe.instructions.map((recipeInstruction, i) => {
									return (
										<li key={i}>{recipeInstruction}</li>
									)
								});
							}

						})()
					}
				</ol>
				<p>Serves: {this.props.recipe.serves}</p>
			</div>
		)
	};
};


//TODO
// need to have states update on save and share. Only working on refresh. need to update that shit on events
// need to make search more evident
// change "my recipes" when there are no recipes to display! (when user first signs up)
// maybe add search to bottom nav???