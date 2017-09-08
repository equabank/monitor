import React, { Component } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const styles = {
  container: {
    paddingTop: 0
  }
};

const muiTheme = getMuiTheme();

export default class Presentation extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          {this.props.showBanner &&
            <div id="presentationTitleBanner">
              <div id="presentationTitleBannerContent">
                <p id="presentationTitleBannerTitleApp">
                  {this.props.bannerTitle}
                </p>
                <p id="presentationTitleBannerUriApp">
                  {this.props.bannerUri}
                </p>
              </div>
            </div>}
          {this.props.bannerNoticeShow &&
            <div id="presentationTitleNoticeBanner">
              <div
                id="presentationTitleNoticeBannerContent"
                className={this.props.bannerNoticeType}
              >
                <p id="presentationTitleNoticeBannerText">
                  {this.props.bannerNoticeText}
                </p>
              </div>
            </div>}
          <div id="presentationContainer">
            <iframe
              src={this.props.uri}
              frameBorder="0"
              id="iframe"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
