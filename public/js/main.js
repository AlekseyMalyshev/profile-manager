'use strict';

$(document).ready(init);

var user;
var $editbox;
var currentId;

function init() {
  $('form.login').on('submit', formSubmit);
  $('div.profile').on('submit', 'form#profile', submitProfile);
  $('button#profile').on('click', loadProfile);
  $('button#others').on('click', loadProfiles);

  $.ajax({
    method: 'GET',
    url: '/api/users/me',
    data: user,
    success: loginOK,
    error: notLogged
  });
}

function notLogged() {
  $('button#profile').css('display', 'none');
  $('form.login>input').css('display', 'inline-block');
  $('form.login>input').attr('required');
  $('form.login>button#login').text('Login');
  user = undefined;
}

function loginOK(data) {
  console.log(data);
  user = data;

  $('button#profile').css('display', 'inline-block');
  $('form.login>input').css('display', 'none');
  $('form.login>input').removeAttr('required');
  $('form.login>button#login').text('Logout');
  loadProfile();
}

function loadProfile() {
  $.ajax({
    method: 'GET',
    url: '/profile',
    success: showProfile,
    error: showError
  });
}

function loadProfiles() {
  $.ajax({
    method: 'GET',
    url: '/profiles',
    success: showProfile,
    error: showError
  });
}

function showProfile(html) {
  $('div.profile').children().remove();
  $('div.profile').append($.parseHTML(html));
}

function formSubmit(event) {
  event.preventDefault();

console.log(user);
  if (user) {
    console.log('loggintin out');
    logout();
  } else {
    console.log('Logginf in');
    login();
  }
}

function logout() {
  $.ajax({
    method: 'POST',
    url: '/api/users/logout',
    success: notLogged,
    error: showError
  });

  $('div.profile').children().remove();
}

function login() {
  var login = {};
  login.name = $('form.login>input#user').val();
  login.pass = $('form.login>input#pass').val();

  $.ajax({
    method: 'POST',
    url: '/api/users/authenticate',
    data: login,
    success: loginOK,
    error: showError
  });
}

function showError(err) {
  if (err.status === 401) {
    $('div#show-error h4.error').text('Incorrect password. Try again or choose another name.');
  }
  else if (err.status === 404) {
    $('div#show-error h4.error').text('Authentication failed.');
  }
  else {
    $('div#show-error h4.error').text('An error has occured. The operation cannot be completed at this time.');
  }
  $('div#show-error').modal();
}

function submitProfile(event) {
  event.preventDefault();
console.log($('input#pass').val());
console.log($('input#_pass').val());
  if ($('input#pass').val() !== $('input#_pass').val()) {
    $('div#show-error h4.error').text('Passwords do not match.');
    $('div#show-error').modal();
  }

  var user = {};
  user.name = $('input#name').val();
  user.pass = $('input#pass').val();
  user.email = $('input#email').val();
  user.address = $('input#address').val();
  user.zipcode = $('input#zipcode').val();
  user.phone = $('input#phone').val();
  user.city = $('input#city').val();
  user.state = $('input#state').val();
  user.avatar = $('input#avatar').val();

  $.ajax({
    method: 'PUT',
    url: '/api/users/me',
    data: user,
    success: loadProfile,
    error: showError
  });
}
