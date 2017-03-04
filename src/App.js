import React, { Component } from 'react';

class App extends Component {

  constructor(){
      super();
      this.state = {location: null, geolocation: false};
  }

  componentDidMount() {
      const uluru = {lat: -25.363, lng: 131.044};
      this.maps = new window.google.maps.Map(this.refs.map, {
          zoom: 8,
          center: uluru
      });

      this.marker = new window.google.maps.Marker({map: this.maps, position: uluru});
      this.geocoder = new window.google.maps.Geocoder();

      console.info("Maps OK.");

      if( "geolocation" in navigator ){
          navigator.geolocation.getCurrentPosition(function(position){
              const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };

              this.setTarget(location);
              this.geocoder.geocode({location: location}, function(results, status){
                  if( status === window.google.maps.GeocoderStatus.OK ){
                      this.setState({
                            location: results[0].formatted_address,
                            geolocation:true
                      });
                  }

              }.bind(this));

              console.info("Get geolocation.");
          }.bind(this))
      }
  }

  calcCoordinate() {
      this.geocoder.geocode({'address': this.state.location}, function(results, status){
         if( status === window.google.maps.GeocoderStatus.OK ){
            this.setTarget(results[0].geometry.location);
            return ;
         }

         this.defaultTarget();
     }.bind(this));
  }

  handleFindNewLocation(event){
      event.preventDefault();

      this.calcCoordinate();
  }

  location (event){
      this.setState({
          location: event.target.value,
          geolocation: false
      });
  }

  setTarget (geolocation) {
      this.maps.setCenter(geolocation);
      this.marker.setPosition(geolocation);
  }

  defaultTarget(){

  }

  render() {
    return (
      <div className="container">
          <div className="columns is-multiline" >
              <div className="column is-half is-offset-one-quarter">

                  <h1 className="title is-1">React Geolocation</h1>
                  <div className="control">
                      <form onSubmit={this.handleFindNewLocation.bind(this)}>
                          <p className="control has-addons">
                              <input type="text" name="location" className="input is-expanded is-info" placeholder="Find location" onChange={this.location.bind(this)}/>
                              <button className="button is-info">Search</button>
                          </p>
                      </form>
                  </div>

                  { this.state.geolocation ? (
                      <article className="message is-success">
                          <div className="message-body">You are on: {this.state.location}</div>
                      </article>
                  ) : (
                      <article className="message is-info">
                          <div className="message-body">Address are you looking for: {this.state.location}</div>
                      </article>
                  )}

              </div>

              <div className="column is-half is-offset-one-quarter">
                  <div ref="map" style={{height: '300px'}}></div>
              </div>
          </div>
      </div>
    );
  }
}

export default App;
