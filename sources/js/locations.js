function locations(app) {

    //GET LOCATION
    app.post('/location', (req, res) => {
        //middleware is used here
     // console.log("recieved request" + req.body); 
      var location = req.body.location;
        
            // modified code snippet from RapidAPI
            console.log('location is in getLocationsId: ' + location)

            var request = require("request");
            var options = {
              method: 'GET',
              url: 'https://tripadvisor1.p.rapidapi.com/locations/search',
              qs: {
                location_id: '1',
                limit: '30',
                sort: 'relevance',
                offset: '0',
                lang: 'en_US',
                currency: 'USD',
                units: 'km',
                query: location

              },
              headers: {
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "614c00f114msh0030c54ce2e3521p16ec63jsn9d328fd87879",
                
              }
            };
            
            request(options, function (error, response, body) {
                  
                    var data = JSON.parse(body)
                     
                    var locationId = data.data[0].result_object.location_id;

                    // Getting the attractions for the location

                    var options_for_loc = {
                      method: 'GET',
                      url: 'https://tripadvisor1.p.rapidapi.com/attractions/list',
                      qs: {
                        lang: 'en_US',
                        currency: 'USD',
                        sort: 'recommended',
                        lunit: 'km',
                        limit: '30',
                        bookable_first: 'false',
                        //subcategory: '36',
                        location_id: locationId
                      },
                      headers: {
                        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                        "x-rapidapi-key": "614c00f114msh0030c54ce2e3521p16ec63jsn9d328fd87879",
                       
                      }
                    };

                    console.log("locationId is: " + locationId)

                    request(options_for_loc, function (error, response, body) {
                      
                        
                        var attractions_data = JSON.parse(body);
                        var tattractions=
                        [
                          {
                          name:"name",
                          description:"descp",
                          web_url:"url",
                          rating:"rating"
                        }
                        ]

                      //  console.log("length is " + attractions_data.data.length);
                      //  console.log("attractions data is \n" + attractions_data);
                      // console.log("\ndata in atrractions data is"+attractions_data.data);
                        //res.send(attractions_data);
                        if(attractions_data.data.length==0)
                          res.render('errhandle',{err:"No Result Found",loc_name:location.toUpperCase()}); 
                        else
                        {
                        if(attractions_data.data.length<5)
                          len=attractions_data.data.length;
                        else len=5;
                        for (var i=0; i<len; i++) 
                        {  
                          tattractions.push(
                            {
                            name:attractions_data.data[i].name,
                            description:attractions_data.data[i].description,
                            web_url:attractions_data.data[i].web_url,
                            rating:attractions_data.data[i].rating
                          });}
                                
                          tattractions.splice(0,1);
                         //console.log(tattractions);
                         var uloc=location.toUpperCase();
                        res.render('top5',{items:tattractions, locname:uloc});
                        }
                    });
            });
      })
    }

module.exports = locations
