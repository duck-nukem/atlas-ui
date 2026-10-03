import { icon } from "../html";

export const memberActions = `
<button class="ui-button" data-variant="ghost" data-size="icon-sm" type="button" popovertarget="member-actions" aria-haspopup="menu" aria-label="Actions for Ada Lovelace">${icon("ellipsis")}</button>
<div class="ui-menu" data-align="end" id="member-actions" popover>
  <a class="ui-menu-item" href="#profile" autofocus>View profile</a>
  <form method="post" action="#role"><button class="ui-menu-item" type="submit">Make admin</button></form>
  <hr class="ui-menu-separator">
  <button class="ui-menu-item" data-variant="destructive" type="button" commandfor="remove-member" command="show-modal">Remove from organization</button>
</div>
<dialog class="ui-dialog" id="remove-member" aria-labelledby="remove-member-title" aria-describedby="remove-member-body" closedby="any">
  <div class="ui-dialog-header">
    <h2 id="remove-member-title">Remove Ada Lovelace?</h2>
    <p id="remove-member-body">Ada Lovelace loses access to this organization right away. Their comments and commits stay, shown as a deleted user.</p>
  </div>
  <div class="ui-dialog-footer">
    <button class="ui-button" data-variant="outline" type="button" commandfor="remove-member" command="close">Cancel</button>
    <form method="post" action="#remove"><button class="ui-button" data-variant="destructive" type="submit">Remove</button></form>
  </div>
  <button class="ui-button ui-dialog-close" data-variant="ghost" data-size="icon-sm" type="button" commandfor="remove-member" command="close" aria-label="Close">${icon("x")}</button>
</dialog>`;
