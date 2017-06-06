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
      leftMenuItem: 1,
      rightMenuItem: 1
    };
  }

  leftMenuHandleChange = (event, index, value) => {
    this.setState({ leftMenuItem: value });

    if (value === 2) {
      hashHistory.push("/");
    }
  };

  rightMenuHandleChange = (event, index, value) => {
    this.setState({ rightMenuItem: value });
    if (index === 2) {
      hashHistory.push("/about");
    }

    if (index === 1) {
      hashHistory.push("/admin");
    }
  };

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <DropDownMenu
            value={this.state.leftMenuItem}
            onChange={this.leftMenuHandleChange}
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
            value={this.state.rightMenuItem}
            onChange={this.rightMenuHandleChange}
          >
            <MenuItem value={1} primaryText="Admin" />
            <MenuItem value={2} primaryText="About Monitor" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
