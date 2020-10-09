import React from 'react';

class LandingPage extends React.Component {

  render() {
    return (
      <div className="landing-page">
        <h2>
          ზოგადი ინფორმაცია extension-ის შესახებ
        </h2>


        {/*
        <div className="section">
        </div>
        */}

        <div className="section">
          ექსთენშენის გახსნა შეიძლება command-ით:
          <br />
          დააჭირე <b>ctrl + shift + p</b> (ან command-ით Mac-ზე) და ჩაწერე შიგ კომანდი: <b>shako.start</b>
        </div>

        <div className="section">
          ექსთენშენს ააქ setting რომელიც შეგიძლია გაწერო და თავისით გაიხსნება ექსთენშენი vsCode-ის ჩართვისთანავე.
          <br />
          თუ არ გახსოვს სეთინგებს ხსნი ესე:
          <br />
          <img src="how-to-open-settings.png" className="how-to-open-settings-image" alt="no display" />
          <br />
          სეთინგებში კიდე ესე ჩაწერე პროსტა და ვსიო:
          <img src="settings-image.png" className="settings-image" alt="no display" />
          <br />
          P.S. შეგიძლია ორივეგან ჩაწერო: ზოგად global სეთინგებში ან კიდე workspace სეთინგეში, რაც მართო კონკრეტულ პროექტზე გავრცელდება.
        </div>


        <br />
        <div className="separator" />
      </div>
    );
  }
}

export default LandingPage;
