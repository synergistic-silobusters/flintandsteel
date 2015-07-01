exports.create = function(id, title, description, author, likes, comments, backs) {
  return new Idea(id, title, description, author, likes, comments, backs);
}

function Idea(id, title, description, author, likes, comments, backs) {
  this.key= id,
	this._id= 'idea_' + id,
	this.ideaId= id,
	this.title= title,
	this.description= description,
	this.author= author,
	this.likes= likes,
	this.comments= comments,
	this.backs= backs

  return this;
}
