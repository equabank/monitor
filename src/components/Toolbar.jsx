import React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon
  from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import { hashHistory } from "react-router";

export default class ToolbarExamplesSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItem: 1
    };
  }

  handleChange = (event, index, value) => {
    this.setState({ menuItem: value });

    if (value === 2) {
      //browserHistory.push("/");
      hashHistory.push("/");
    }
  };

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <DropDownMenu
            value={this.state.menuItem}
            onChange={this.handleChange}
          >
            <MenuItem value={1} primaryText="Timeline" />
            <MenuItem value={2} primaryText="Show presentations" />
          </DropDownMenu>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Monitor" />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Options" />
            <MenuItem primaryText="About Monitor" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
