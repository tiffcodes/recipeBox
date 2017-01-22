import React from 'react';

export default class RecipeCard extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			recipeSaved: false,
			recipeShared: false
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
		 		this.setState({
		 			recipeShared: false
		 		})

		  alert('Note: deleting this public recipe does not automatically delete your private recipe');
		}
		
	}

	saveToMyRecipes(recipeToSave) {
		firebase.database().ref(`recipe/${recipeToSave.key}`).on('value',  (res) => {
			const data = res.val();
			// save to firebase db private list:
			firebase.database().ref(`${this.props.currentUser}/recipe`).push(data);
			this.setState({
				recipeSaved: true
			})
		});
	}

	shareRecipe(recipeToShare) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).on('value',  (res) => {
			const data = res.val();
			// add user id to the global recipe object
			data['userId'] = this.props.currentUser;
			// save to firebase db in public recipes:
			firebase.database().ref('recipe').push(data);
			// add user id to original private recipe:
			console.log('next step');
			firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).push(data);
			// set state to show recipe is shared:
			this.setState({
				recipeShared: true
			})
			console.log('done');
		});
	}

	getRemoveButton(){
		if (this.props.isGlobal && 
			this.props.recipe.userId === this.props.currentUser) {
			
			return <i className="fa fa-times" onClick={(e) => this.removeGlobalRecipe.call(this, this.props.recipe)}></i>

		} else if (this.props.isGlobal === false) {
			return <i className="fa fa-times" onClick={(e) => this.removeRecipe.call(this, this.props.recipe)}></i>
		}
	}

	getBookmark() {
		if(this.props.isGlobal && 
			this.state.recipeSaved === false 
			&& this.props.recipe.userId !== this.props.currentUser ) {
			
			return <i className="fa fa-star-o" onClick={(e) => this.saveToMyRecipes.call(this, this.props.recipe)}></i>

		} else if (this.props.recipe.userId === this.props.currentUser) {
			return <i className="fa fa-star"></i>

		} 
	}

	getShareRecipeButton() {
		if(this.props.isGlobal === false  &&
			!this.props.recipe.userId ) {

			return ( 
				<div>
					<i className="fa fa-share-alt" onClick={(e) => this.shareRecipe.call(this, this.props.recipe)}></i>
					<p>Share</p>
				</div> )

		} else if (this.props.isGlobal === false &&
			this.props.recipe.userId ){
			
			return (
				<div>
					<i className="fa fa-share-alt green"></i>
					<p>Shared</p>
				</div> )
		}
	}

	render() {
		return (
			<div className="recipe" id={this.props.checkAlphabet(this.props.firstLetter, this.props.alphabet)} >
				{this.getRemoveButton()}
				{this.getBookmark()}
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