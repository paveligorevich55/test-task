$( function () {
    var loader = {
        data: '',
        page: 1,
        loading: false,
        show: false, 
        total: 0,
        shown: 4,
        loadNext: function () {
            this.page++;
            this.loading = true;
            $.ajax( {
                method: "GET",
                url: "list.php",
                dataType: 'json',
                data: {
                    page: this.page 
                },
                success: function ( result ) {
                    loader.data = buildData( result );
                    loader.loading = false;
                    loader.total = result.total;
                    if ( loader.show ) {
                        $( '#list' ).append( loader.data );
                        $( '.list-item' ).hide().fadeIn();
                        loader.show = false;
                        loader.loadNext(); 
                        $( '#list' ).removeClass( 'preloader' );
                        
                    }
                }
            } );
        },
        loadMore: function () {
            if ( this.loading ) {
                if ( !this.show ) {
                    this.show = true;
                    this.shown += 4;
                    if ( this.total > 0 && this.shown >= this.total ) {
                        $( '#load-more' ).hide();
                    }
                    $( '#list' ).addClass( 'preloader' );
                }
            } else {
                $( '#list' ).append( this.data );
                this.shown += 4;
                if ( this.total > 0 && this.shown >= this.total ) {
                    $( '#load-more' ).hide();
                } else
                    this.loadNext();
            }
        }
    };
    
    $( '#load-more' ).click( function () {
        loader.loadMore();
    } );
    loader.loadNext();
} );

function buildData( page ) {
    var data = '';
    for ( var index in page.entities ) {
      
        var img = new Image();
        img.src = page.entities[index].img;
        
        var s = '<li class="list-item text-left">';
        s += '<div class="item-img text-center">';
        s += '<img src="' + page.entities[ index ].img + '" alt="' + page.entities[ index ].title + '"/>';
        if ( page.entities[ index ].discountCost !== null ) {
            s += page.entities[ index ].cost;
            s += '<div class="label-sale text-uppercase">sale</div>';
        }
        
        if ( page.entities[ index ].new ) {
            s += '<div class="label-new text-uppercase">new</div>';
        }
        
        s += '</div>';
        s += '<div class="item-content">';
        s += '<div class="description">';
        s += '<p><strong class="title">' + page.entities[ index ].title + '</strong></p>';
        s += '<p>' + page.entities[ index ].description + '</p>';
        s += '</div>';
        s += '<p class="price">';
        if ( page.entities[ index ].discountCost !== null ) {
            s += '<span class="discount-price">$' + (page.entities[ index ].discountCost).toFixed( 2 ) + '</span>';
            s += '<del class="old-price">$' + (page.entities[ index ].cost).toFixed( 2 ) + '</del>';
        } else {
            s += '<span class="discount-price">$' + (page.entities[ index ].cost).toFixed( 2 ) + '</span>';
        }
        s += '</p>';
        s += '<div class="item-btns row">';
        s += '<div class="col-lg-12">';
        s += '<button class="custom-btn btn-add text-uppercase">add to cart</button>';
        s += '<button class="custom-btn btn-view text-uppercase">view</button>';
        s += '</div>';
        s += '</div>';
        s += '</div>';
        s += '</li>';
        
        data += s;
    }
    return data;
}
