import type { Meta } from "@storybook/react-vite";
import { html, mobile } from "../html";

const signIn = `
<form method="post" action="#login" style="display:grid;gap:1rem;max-width:24rem">
  <div class="ui-field">
    <label class="ui-label" for="email">Email</label>
    <input class="ui-input" id="email" name="email" type="email" autocomplete="email" required>
  </div>
  <div class="ui-field">
    <label class="ui-label" for="password">Password</label>
    <input class="ui-input" id="password" name="password" type="password" autocomplete="current-password" required>
  </div>
  <button class="ui-button" type="submit">Sign in</button>
</form>`;

export default { title: "Primitives/Form" } satisfies Meta;

export const SignIn = html(signIn);

export const WithError = html(`
<form method="post" action="#invite" style="display:grid;gap:1rem;max-width:24rem">
  <div class="ui-field">
    <label class="ui-label" for="invite">Email</label>
    <input class="ui-input" id="invite" name="email" type="email" value="ada@" aria-invalid="true" aria-describedby="invite-error">
    <p class="ui-feedback" id="invite-error">Enter a valid email address</p>
  </div>
  <button class="ui-button" type="submit">Invite</button>
</form>`);

export const Textarea = html(`
<div class="ui-field" style="max-width:24rem">
  <label class="ui-label" for="description">Description</label>
  <textarea class="ui-textarea" id="description" name="description"></textarea>
</div>`);

export const Saved = html(`<p class="ui-feedback" role="status">Saved</p>`);

export const Mobile = mobile(signIn);
