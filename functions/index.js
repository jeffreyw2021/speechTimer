const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUnverifiedUser = functions.auth.user().onCreate((user) => {
  // Wait for 60 seconds
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Reload user data from Firebase
      const updatedUser = await admin.auth().getUser(user.uid);

      // Check if email is verified
      if (!updatedUser.emailVerified) {
        // Email not verified, delete user
        await admin.auth().deleteUser(user.uid);
        console.log("Deleted unverified user:", user.uid);
      }

      resolve();
    }, 59000);
  });
});
