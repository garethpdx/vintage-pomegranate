
// $(function(){
//     $("form").on('submit', function(e){
//         e.preventDefault();
//         $t = $(e.target);
// 	var i = $t.find('#post-id').val();
//         var title = $t.find('#post-title').val();
//         var body = $t.find('#post-body').val();
//         window.postList.posts.push({
//     	    title: title,
//     	    body: body})
//     });
// });


function listPosts(){
    window.posts.map(function(post){
	var $elem = $("<li/>", {
	    text: post.title
	});
	$elem.data('id', post.id)
	$elem.data('body', post.body)
	$(".post-list ul").append($elem);
    });
    // clicking a post fills the editor
    $(".post-list ul li").on('click', function(e){
	fillForm(e.target);
    });

    $("form").on('submit', function(frm){
	// validate form
	// serialize
	// submit to lambda
    });
}

fillForm = function(e){
    var $elem = $(e);
    $("#post-id").val($elem.data('id'));
    $("#post-title").val($elem.text());
    $("#post-body").val($elem.data('body'));
}
