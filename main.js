// TODO
// organize editing controls
// deploy lambda fn
// 
/*

Editor UI


*/


const Posts = {
    data() {
	return {
	    posts: [],
	    editing: {post: null },
	    selected: {post: null }
	};
    },
    mounted() {
	updatePosts = function(posts){
	    this.posts = posts;
	}
	jQuery.getJSON('/data.js', updatePosts.bind(this));
    },
    methods: {
	addpost(post){
	    // does post have an ID? if so, do an update instead
	    if(post.id){
		for(let i=0; i<this.posts.length; i++){
		    if(this.posts[i].id == post.id){
			this.posts[i] = post;
		    }
		}
		return
	    }
	    // if not, generate one
	    this.posts.push(post);
	},
	select(post){
	    // clicked the list-item
	    this.selected = post;
	    $('body').toggleClass('has-modal');
	},
	clearSelected(){
	    this.selected = {post: null }
	    $('body').toggleClass('has-modal');
	},
	who(){
	    console.log('root');
	},
	thumbnails(post){
	    return post.images.map(i =>  i+'=h370-no');

	},
	parentPostSelected(post){
	    this.editing.post = post;
	},
	saveAll(){
	    console.log('updating')
	    savePosts(this.posts, );
	}
    }
};

function savePosts(posts, callback){
    // lambda function that saves our posts
    url = 'https://[LAMBDA_BASE]/updatePosts';
    $.ajax({
	url: url,
	complete: callback,
	failed: function(e){ alert(e) } ,
	complete: function(){console.log('Completed update')},
	method:'POST',
	data: {posts: JSON.stringify(posts)},
    });
}

const postApp = Vue.createApp(Posts);

const editor = postApp.component('editor', {
    props: ['post'],
    created(){
	this.$watch('post', function(n, old,c){
	    for (const [key, value]  of Object.entries(this.post)) {
		this.draft[key] = value;
	    }	    
	});
    },
    data(){
	return {
	    draft: {
		title: '',
		body: '',
		id: null,
		images: []
	    },
	}
    },
    emits: ['save'],
    methods: {
	save(){
	    this.$emit('save', {
		title: this.draft.title,
		body: this.draft.body,
		id: this.draft.id,
		images: this.draft.images
	    });
	},
	logme(){
	    console.log(this.title);
	},
	who(){
	    console.log('editor');
	},
	reset(){
	    this.draft.title = '';
	    this.draft.body = '';
	    this.draft.id = this.uuid4();
	    this.draft.images = [];
	},
	deleteImage(url){
	    var ind = this.draft.images.indexOf(url);
	    this.draft.images.splice(ind, 1);
	},
	toTheTop(url){
	    this.draft.images.unshift(this.draft.images.splice(this.draft.images.indexOf(url), 1));
	},
	addImages(images){
	    this.draft.images = images;
	},
	uuid4() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16)
	    });
	}
    },
    template: `
	    <div class="form-row">
	      <label for='post-id'>Id</label>
	      <input  type="text" name="id" id="post-id" readonly disabled v-model="draft.id">
	    </div>
	    <div class="form-row">
	      <label for='post-title'>Title</label>
	      <input type="text" name="title" id="post-title" v-model="draft.title">
	    </div>
	    <div class="form-row">
	      <label for='post-body'>Body</label>
	      <textarea name="body" id="post-body" v-model="draft.body"></textarea>
	    </div>
            <div class="form-row">
	      <label for='post-body'>Submit Password</label>
	      <input type="password" name="password">
	    </div>
            <imageloader @imagesLoaded="addImages"></imageloader>
	    <div class="form-row">
              <button @click.prevent='save'>Save Form</button>
	    </div>
	    <div class="form-row">
              <button @click.prevent='reset'>Reset Form</button>
	    </div>
            <hr>
             <h2>{{ draft.title}}</h2> <br>
             <p>{{ draft.body}}</p>
             <ul>
               <li v-for="image in draft.images"><img v-bind:src="image"><span @click="toTheTop(image)">(t)</span><span @click="deleteImage(image)">(x)</span></li>
             </ul>
`
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// postApp.component('imag', {
//     data(){
// 	return {
// 	    file:''
// 	}
//     },
//     // https://github.com/nodeca/pica
//     // https://raw.githubusercontent.com/nodeca/pica/master/index.js
//     // https://github.com/nodeca/image-blob-reduce
//     // https://raw.githubusercontent.com/nodeca/image-blob-reduce/master/index.js
//     template: `
// <input type="file" multiple accept="image/*" id="uploader">
// <img id="result">
// `
// });

postApp.component('imageloader', {
    emits: ['imagesLoaded'],
    data(){
	return {
	    url: '',
	    uploadError: ''
	}
    },
    methods: {
	go(){
	    // this.images.push('https://lh3.googleusercontent.com/RFg5R_nHrqL3rGRxM_y6EAEa2nTlXVzKtBMLg9ydevUeaNvyEW--ELR54QzXa8AYwTnCJLZ5jduVufMdPeBH-M0Or-yyJQLapFnYE-FTPT9Pq01NKYnWsCINrwTJNyZSOua_98PD4Q=w96-h72-no');
	    this.uploadError = '';
	    var data = '{"images": ["https://gp3.googleusercontent.com/a/AATXAJzFzSMfbekjhREgfDXxUJwjGU5tcQ9ETnuanno=s32-p-no", "https://lh3.googleusercontent.com/sroI-VYYUKJgQsXEHE66UUNoFqSu5Yp4mULg_wCcA_soeELJFgA4ykdH_9ykafSG2dOvehGj3nVcXzw7YcYoYEciI8s0eoXiUqHrtt1QCNw1BfvutXq3LyZbQBYXda-VjoTfkGiSWA=w96-h72-no", "https://lh3.googleusercontent.com/2qvb5UxsdEkRmyiDTsQNGtR7O36IAkNQtfPp6xGaMVVh2IfVVq4ml9BanEiIIggrATthVDWRJyxGrQBe0lNWv1Mm_LfJ2TGQYNlTzb3VXalYWXXEKZjdChO9XCD4VjR-FoihIGld1g=w96-h72-no", "https://lh3.googleusercontent.com/qjHHpRKk967mKO-M8wVXOLEK70pJMltwsCfr0V6W3LuVntXkds0lS7va3dHy0UBkdNiYigBTl5gk_V_0uxmbEd4TLP3IGf6AJ05RLLg_ij41YB6ISI_vPKzMou2Kw8UJaVQ53Lnb3A=w96-h72-no", "https://lh3.googleusercontent.com/VRQ44YanM2HhSpL7Gr5OzmGOCeXVa9mtX4Q0NQUvcGtaV5urN_qvXY_hji8HuqYETPFS3DnARG4bjRZGE9lQUrMjf8b7c6FML1DDyNJ_WZ-_FIyEgQLER1WZhFcBFmU-2dCbx7IHYg=w96-h72-no", "https://lh3.googleusercontent.com/cdP-2Q9E96VIsBpdwXud1ods8OXKnwkLbBLfjYodyDy4M7a_j7Rh6iOOz0rfxrvrKrjM3PuSosSZHNrfQxtWH-hma37U_9LCFIwwQ-nLvstFQi9pDbdbj3QEao0UbqMcWzrw5S2uJg=w96-h72-no", "https://lh3.googleusercontent.com/3OK0WcTOWlBNABvwypo1KTI9cQ1PO3re_rdDdbMkY8IXEm1r5bA2WxREEHa5MoYQF_BPLiH7yg0noLEbW21irgN3LDhSZk9x5lxlSN1MS21U2UUdDRgkrPK6fffa-F8wfnBlPCIKmA=w96-h72-no", "https://lh3.googleusercontent.com/90F1_1nxNfoBM8A07S21dHODSYPL-6IMp6GT7lGc0el83PniwHBnvOt1jU7-EFr7InTQ7wFe-WnJDga5Tst0fTwxNyaMiWfIVayQ8XuyOVHmGYhBlq9AjeDiLp4mbdPyO8Qfzt7nfA=w96-h72-no", "https://lh3.googleusercontent.com/uJ1cRPUg0fnL7NHTl1a60232_YqYUs3WJssMw-dfTRQFBMGQh8ad9zn0hZcAYoU4DPWGwVSzXtW9g5ZI26Fa9-IpOUfHYS58aycaeQbsD4DS08RoMGAHeGeTEGJJ5_nmUiR3Vg580g=w96-h72-no", "https://lh3.googleusercontent.com/247WawV2L_VxU6aH_EE8oMamiTTSQPOAKMoIRkp6wy-1_yfd_QrrzchxAyCwUAyvIve0x2TBseyX2pH3ew85Zsv0fE-JzFGJk7AieN2OjdyAC41BIgM3gJWqzFjAm77AGEJIwGZusg=w96-h72-no", "https://lh3.googleusercontent.com/RFg5R_nHrqL3rGRxM_y6EAEa2nTlXVzKtBMLg9ydevUeaNvyEW--ELR54QzXa8AYwTnCJLZ5jduVufMdPeBH-M0Or-yyJQLapFnYE-FTPT9Pq01NKYnWsCINrwTJNyZSOua_98PD4Q=w96-h72-no"], "error": ""}';
	    this.addImages(data, 'success', {});
	    return;
	    $.ajax({
		url: 'https://0lsubwlwa7.execute-api.us-west-2.amazonaws.com/editor/photos',
		success: this.addImages,
		method:'POST',
		data: {url: this.url},
		error: this.setError
	    });
	},
	addImages(data, status, request){
	    var images = JSON.parse(data).images;
	    this.$emit('imagesLoaded', images);
	},
	setError(request, error, status){
	    this.uploadError = 'error: ' + error;
	}
    },
    template:
    `
<div class="form-row">
  <label>Google Photos Link: </label><input  type='text' name='url' v-model='url'> (New posts only)<br> 
</div>
<div class="form-row">
   <button @click.prevent="go">Load Images From Google</button>
</div>
<h3 v-if="uploadError">{{ uploadError }}</h3>
`
});

function imagesFromGoogle(url, callback){
    $.ajax({
	url: 'https://[LAMBDA_BASE]/editor/photos',
	complete: callback,
	method:'POST',
	data: {url: url},
    });
}


postApp.component('eli', {
    props: ['title'],
    emits: ['selected'],
    template: `<li @click="$emit('selected')">{{ title }}</li>`,
    methods: {
	// popLast(e){
	//     console.log(this.id);
	//     console.log(mtd.$data.posts)
	//     mtd.$data.posts.pop()
	// },
	// fillEditor(){
	//     mtd.$data.xeditor.title = this.title;
	//     mtd.$data.xeditor.id = this.id;
	// },
	// postSelected(postId){
	//     console.log('child hey');
	// },
	// bob(){
	//     console.log('bob');
	// },
	who(){
	    console.log('eli');
	}
    }
});


const mtd = postApp.mount('#posts');
