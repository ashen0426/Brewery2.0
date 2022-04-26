(async () => {
  // Register a new user and get an id, which comes from the RETURNING clause.
  const registerResult = await registerUser({
    firstName: "Jane",
    lastName: "Doe",
    homeState: "Florida",
    userName: "floridajane",
    passWord: "12d2f456sde3",
    hasFavorites: "false",
  });

  const userId = registerResult.rows[0]["id"];
  console.log("Registered a user with id: " + userId);

  // Obtain the full user object from the database.
  const getUserResult = await getUser(userId);
  console.log(
    "Result of SELECT query for user '" +
      userId +
      "': " +
      JSON.stringify(getUserResult.rows[0], null, "  ")
  );

  // Update the user's full name and query for them again to verify.
  await updateUserName(userId, "Jane Johnson");
  const getChangedUserResult = await getUser(userId);
  console.log(
    "Result of SELECT query for user after name change '" +
      userId +
      "': " +
      JSON.stringify(getChangedUserResult.rows[0], null, "  ")
  );

  // Clean up the database by removing the user record.
  await removeUser(userId);

  await pool.end();
})();
