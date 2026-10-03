import type { Meta } from "@storybook/react-vite";
import { html, icon, mobile } from "../html";

const signIn = `
<form class="ui-form" method="post" action="#sign-in">
  <div class="ui-field">
    <label class="ui-label" for="email">Email</label>
    <input class="ui-input" id="email" name="email" type="email" autocomplete="email" required>
  </div>
  <div class="ui-field">
    <label class="ui-label" for="password">Password</label>
    <input class="ui-input" id="password" name="password" type="password" autocomplete="current-password" required>
  </div>
  <div class="ui-form-actions"><button class="ui-button" type="submit">Sign in</button></div>
</form>`;

export default { title: "Primitives/Form" } satisfies Meta;

export const SignIn = html(signIn);

export const Settings = html(`
<form class="ui-form" method="post" action="#settings">
  <div class="ui-form-row">
    <div class="ui-field">
      <label class="ui-label" for="name">Name</label>
      <input class="ui-input" id="name" name="name" value="Atlas">
    </div>
    <div class="ui-field">
      <label class="ui-label" for="timezone">Time zone</label>
      <select class="ui-input" id="timezone" name="timezone">
        <option>Europe/Budapest</option>
        <option>Europe/London</option>
      </select>
    </div>
  </div>
  <div class="ui-field">
    <label class="ui-label" for="about">About</label>
    <textarea class="ui-input" id="about" name="about" aria-describedby="about-hint"></textarea>
    <p class="ui-hint" id="about-hint">Shown on the organisation page</p>
  </div>
  <fieldset class="ui-fieldset">
    <legend>Visibility</legend>
    <label class="ui-check"><input type="radio" name="visibility" value="private" checked> Private</label>
    <label class="ui-check"><input type="radio" name="visibility" value="public"> Public</label>
  </fieldset>
  <label class="ui-check"><input type="checkbox" name="archived"> Archived</label>
  <div class="ui-form-actions">
    <button class="ui-button" data-variant="outline" type="reset">Reset</button>
    <button class="ui-button" type="submit">Save</button>
  </div>
</form>`);

export const WithErrors = html(`
<form class="ui-form" method="post" action="#invite">
  <div class="ui-alert" data-variant="danger" role="alert">${icon("circle-alert")} Fix the fields below</div>
  <div class="ui-field">
    <label class="ui-label" for="invite">Email</label>
    <input class="ui-input" id="invite" name="email" type="email" value="ada@" aria-invalid="true" aria-describedby="invite-error">
    <p class="ui-error" id="invite-error">Enter a valid email address</p>
  </div>
  <div class="ui-field">
    <label class="ui-label" for="disabled-role">Role</label>
    <input class="ui-input" id="disabled-role" value="Member" disabled>
  </div>
  <div class="ui-form-actions"><button class="ui-button" type="submit">Invite</button></div>
</form>`);

export const Saved = html(
  `<div class="ui-alert" data-variant="success" role="status">${icon("circle-check")} Settings saved</div>`,
);

export const Mobile = mobile(signIn);
