import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

export default class RecipeCard extends React.Component {
	constructor(props, context) {
		super();
		this.state = {
			publicRecipeSaved: false, 
			privateRecipeDownloaded: false,
			recipeShared: false,
			alert: null
		}
	}	

	handleState() {
		// Private view state handling:
		// console.log('is global', this.props.isGlobal);
		// console.log("Handle State", this.props.recipe.title);
		
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
			
			if (filtered.length > 0) {
				this.setState({
					publicRecipeSaved: true
				})
			}
			this.setState({
				recipeShared: false
			})
		} else if (this.props.recipe.userId === undefined ) {
			this.setState({
				privateRecipeDownloaded: false,
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
	}
	componentDidMount() {
		// console.log(this.props.isGlobal);
		this.handleState();
	}

	removeRecipe(recipeToRemove) {
		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToRemove.key}`).remove();
		alert('Deleting this recipe does not automatically delete the public recipe');
	}

	onCancelDelete() {
		<SweetAlert
			success 
			title="Cool! We will not delete this recipe" >	
			onConfirm={() => this.hideAlert}
		</SweetAlert>
		
		this.setState({
		 alert: getAlert()
		});
		
	}

	sweetAlert() {
		const getAlert = () => (
			<SweetAlert 
			success 
			title="Woot!" 
			onConfirm={() => this.hideAlert()}
			>
			Hello world!
			</SweetAlert>
		);

		this.setState({
		 alert: null
		});
		
	}

	hideAlert() {
	  // console.log('Hiding alert...');
	  this.setState({
	    alert: null
	  });
	}

	removeRecipeConfirm(recipeToRemove) {
		if (confirm('Are you sure you want to delete this recipe?')){
			this.removeRecipe(recipeToRemove);
		} else {
			this.onCancelDelete();
		}
	}

	removeGlobalRecipe(recipeToRemove) {
		if (confirm('Are you sure you want to delete this recipe')) { 
			firebase.database().ref(`recipe/${recipeToRemove.key}`).remove();
			// delete the userId on the private version of the recipe here
			alert('Note: deleting this public recipe does not automatically delete your private recipe');
		 } else {
			this.onCancelDelete();
		 }
	}


	saveToMyRecipes(recipeToSave) {
		firebase.database().ref(`recipe/${recipeToSave.key}`).on('value',  (res) => {
			const data = res.val();
			// save to firebase db private list:
			firebase.database().ref(`${this.props.currentUser}/recipe`).push(data);
			this.handleState();
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
		});

		firebase.database().ref(`${this.props.currentUser}/recipe/${recipeToShare.key}`).on('value',  (res) => {
			const data = res.val();
			// add user id to the recipe object
			data['userId'] = this.props.currentUser;
			// save to firebase db in public recipes:
			firebase.database().ref('recipe').push(data);
			// set state to show recipe is shared:
		});
		this.handleState();
		this.setState({
			recipeShared: true
		})
	}

	getRemoveButton(){
		if (this.props.isGlobal && 
			this.props.recipe.userId === this.props.currentUser) {
			
			return <i className="fa fa-times upperLeft" onClick={(e) => this.removeGlobalRecipe.call(this, this.props.recipe)}></i>

		} else if (this.props.isGlobal === false) {
			return <i className="fa fa-times upperLeft" onClick={(e) => this.removeRecipeConfirm.call(this, this.props.recipe)}></i>
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
			return  <div className="upperRight clearfix clickable"
						onClick={(e) => this.saveToMyRecipes.call(this, this.props.recipe)}>
						<p className="textHint">Save</p>
						<i className="fa fa-star-o"></i>
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
				<div className="upperRight clearfix clickable"
					onClick={(e) => this.shareRecipe.call(this, this.props.recipe)}>
					<p className="textHint">Share</p>
					<i className="fa fa-share-alt"></i>
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

	getRecipeIngredients() {
		if(this.props.recipe.ingredients !== "") {
			return this.props.recipe.ingredients.map((recipeIngred, i) => {
					return (
						<li key={i}>{recipeIngred}</li>
					)
				}
			);
		}
	}

	getRecipeInstructions(){
		if(this.props.recipe.instructions !== "") {
			return this.props.recipe.instructions.map((recipeInstruction, i) => {
					return (
						<li key={i}>{recipeInstruction}</li>
					)
				}
			);
		}
	}

	render() {
		return (
			<div className="recipe" id={this.props.checkAlphabet(this.props.firstLetter, this.props.alphabet)} >

				{this.getRemoveButton()}
				{this.getSaveRecipeButton()}
				{this.getShareRecipeButton()}
				
				<h2 id={this.props.recipe.title}>{this.props.recipe.title}</h2>
				<p><span className="formLabel">Prep Time:</span> {this.props.recipe.prepTime}</p>
				<p><span className="formLabel">Total Time:</span> {this.props.recipe.totalTime}</p>
				<p><span className="formLabel">Ingredients:</span></p>
				<ul>
					{this.getRecipeIngredients()}
				</ul>
				<p><span className="formLabel">Instructions:</span></p>
				<ol>
					{this.getRecipeInstructions()}
				</ol>
				<p><span className="formLabel">Serves/Notes:</span> {this.props.recipe.serves}</p>
				<button onClick={() => this.testing()}>Click me to see alert</button>
				{this.state.alert}
			</div>
		)
	};
};


//TODO
// need to have states update on save and share. Only working on refresh. need to update that shit on events
// need to make search more evident
// change "my recipes" when there are no recipes to display! (when user first signs up)
// maybe add search to bottom nav???