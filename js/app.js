$(function() {
	Game.init( $("#game") );
});
var Game = {
	gk: [
		{
			map: [
				1,1,2,2,2,2,1,1,
				1,1,2,4,4,2,1,1,
				1,2,2,3,4,2,2,1,
				1,2,3,3,3,4,2,1,
				2,2,3,3,3,3,2,2,
				2,3,3,2,3,3,3,2,
				2,3,3,3,3,3,3,2,
				2,2,2,2,2,2,2,2
			],
			box: [
				{x: 4, y: 3},
				{x: 3, y: 4},
				{x: 4, y: 5},
				{x: 5, y: 5}
			],
			person: {
				x: 3, 
				y: 6
			}
		}
	],
	init: function( target ) {
		this.oParent = target;
		
		this.createMap( 0 );
	},
	createMap: function( iNow ) {
		if( this.oParent ) {
			this.oParent.empty();
		}
		document.title = "第"+(iNow + 1)+"关";
		this.iNow = iNow;
		this.now = this.gk[ iNow ];
		this.oParent.css("width", Math.sqrt( this.now.map.length ) * 50);
		$.each(this.now.map, $.proxy( function(index, elem ) {
//			this.oParent.append( '<div class="pos' + elem + '"></div>' );
			this.oParent.append("<div class=pos"+ elem +"></div>");
		}, this) );
		
		this.createBox();
		this.createPerson();
	},
	createBox: function() { //创建箱子
		$.each(this.now.box, $.proxy(function(index, elem) {
			var oB = $("<div class=box></div>");
			oB.css({
				left: elem.x * 50,
				top: elem.y * 50
			});
			this.oParent.append( oB );
		}, this));
	},
	createPerson: function() { // 创建人物
		var oP = $("<div class=person></div>");
		oP.css({
			left: this.now.person.x * 50,
			top: this.now.person.y * 50
		});
		
		oP.data("x", this.now.person.x);
		oP.data("y", this.now.person.y);
		
		this.oParent.append( oP );
		this.movePerson( oP );
	},
	movePerson: function( oP ) {
		$(document).keydown( $.proxy( function( event ) {
			var e = event || window.event;
			switch( event.which ) {
				case 37:  //←
					oP.css("backgroundPosition", "-50px 0");
					this.runperson( oP, {x: -1});
				break;
				case 38:  //↑
					oP.css("backgroundPosition", "0 0");
					this.runperson( oP, {y: -1});
				break;
				case 39:  //→
					oP.css("backgroundPosition", "-150px 0");
					this.runperson( oP, {x: 1});
				break;
				case 40:  //↓
					oP.css("backgroundPosition", "-100px 0");
					this.runperson( oP, {y: 1});
				break;
			}
		}, this ) );
	},
	runperson: function ( oP, opt ) {
		var stateX = opt.x || 0;
		var stateY = opt.y || 0;
		
		if( this.now.map[ ( oP.data("y") + stateY ) * Math.sqrt( this.now.map.length ) + ( oP.data("x") + stateX ) ] != 2 ) {
			oP.data("x", oP.data("x") + stateX );
			oP.data("y", oP.data("y") + stateY );
			oP.css("left", oP.data("x") * 50 );
			oP.css("top", oP.data("y") * 50 );
		}
		$(".box").each($.proxy( function( index, elem) {
			if( this.attack( oP, $(elem) ) && this.now.map[ ( oP.data("y") + stateY ) * Math.sqrt( this.now.map.length ) + ( oP.data("x") + stateX ) ] != 2 ) {
				$(elem).css("left", ( oP.data("x") + stateX ) * 50 );
				$(elem).css("top", ( oP.data("y") + stateY ) * 50 );
				
				$(".box").each($.proxy( function( index2, elem2 ) {
					if( this.attack( $(elem), $(elem2) ) && elem != elem2 ) {
						$(elem).css("left", oP.data("x") * 50 );	
						$(elem).css("top", oP.data("y") * 50 );
						
						oP.data("x", oP.data("x") - stateX );
						oP.data("y", oP.data("y") - stateY );
						oP.css("left", oP.data("x") * 50 );
						oP.css("top", oP.data("y") * 50 );
					}
				}, this));
			} else if( this.attack( oP, $(elem) ) ) {
				oP.data("x", oP.data("x") - stateX );
				oP.data("y", oP.data("y") - stateY );
				
				oP.css("left", ( oP.data("x")) * 50 );
				oP.css("top", ( oP.data("y")) * 50 );
			}
		}, this));
		this.nextMap();
	},
	nextMap: function() {
		var iNum = 0;
		$(".pos4").each( $.proxy( function( index1, elem1 ) {
			$(".box").each($.proxy(function( index2, elem2) {
				if( this.attack( $(elem1), $(elem2) )) {
					iNum++;
				}
			},this));
		}, this));
		if( iNum === $(".box").length ) {
			this.createMap( this.iNow + 1 );
		}
	},
	attack: function( obj1, obj2 ) {
		var left1 = obj1.offset().left;
		var right1 = obj1.offset().left + obj1.width();
		var top1 = obj1.offset().top;
		var bottom1 = obj1.offset().top + obj1.height();
		
		var left2 = obj2.offset().left;
		var right2 = obj2.offset().left + obj2.width();
		var top2 = obj2.offset().top;
		var bottom2 = obj2.offset().top + obj2.height();
		
		if( left1 >= right2 || right1 <= left2 || top1 >= bottom2 || bottom1 <= top2 ) {
			return false;
		} else {
			return true;
		}
	}
}
