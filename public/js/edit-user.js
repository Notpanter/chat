document.addEventListener('DOMContentLoaded', () => {
    const editUserModal = document.getElementById("editUserModal");
    const editBtns = document.querySelectorAll(".editUserBtn");
    const closeBtn = editUserModal.querySelector(".close");
    const deleteUserBtn = editUserModal.querySelector("#deleteUserBtn");
    const userNameInput = editUserModal.querySelector("#userName");
    const userEmailInput = editUserModal.querySelector("#userEmail");
    const userRoleInput = editUserModal.querySelector("#userRole");
    const userIdInput = editUserModal.querySelector("#userId");
    // Show edit user modal when edit button is clicked
    editBtns.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            editUserModal.style.display = "block";
            const userId = btn.dataset.userId; // assuming you have data attribute for user ID

            // Fetch user data using userId
            const response = await fetch(`/admin/${userId}`);
            const userData = await response.json();

            // Populate form fields with user data
            userNameInput.value = userData.name;
            userEmailInput.value = userData.email;
            userRoleInput.value = userData.role;
            userIdInput.value = userId;
        });
    });

    // Close edit user modal when close button is clicked
    closeBtn.addEventListener('click', () => {
        editUserModal.style.display = "none";
    });

    // Close edit user modal when user clicks outside of it
    window.onclick = function(event) {
        if (event.target == editUserModal) {
            editUserModal.style.display = "none";
        }
    };

    // Handle form submission for updating user information
    const editUserForm = document.getElementById("editUserForm");
    editUserForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        // Submit form data using fetch API or AJAX
        const formData = new FormData(editUserForm)
        const userId = formData.get('userId');
        // alert(`/admin/update/${userId}`)
            
        try{
            // for (var pair of formData.entries()) {
            //     alert(pair[0]+ ', ' + pair[1]);
            //     // console.log(pair[0]+ ', ' + pair[1]); 
            // }
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role')
            };
    
            const response = await fetch(`/admin/update/${userId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },    
                body: JSON.stringify(userData)
            });            
            // alert(`/admi n/update/${userId}`)
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                editUserModal.style.display = "none";
                location.reload(); // Reload the page to reflect the changes
            } else {
                const errorResult = await response.json();
                alert('Failed to update user: ' + errorResult.error);
            }    
        }catch (error) {
            console.error('Error:', error);
            alert('Failed to update user');
        }
    });

    // Handle delete user button click
    deleteUserBtn.addEventListener('click', async () => {
        // Perform delete user operation using fetch API or AJAX
        const userId = userIdInput.value;
        try{
            // console.log(`/admin/delete/${userId}`)
            const response = await fetch(`/admin/delete/${userId}`,{
                method: 'delete',
            });
            // console.log(response)
            // alert(`/admin/delete/${userId}`)
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                editUserModal.style.display = "none";
                location.reload(); // Reload the page to reflect the changes
            } else {
                alert('Failed to delete user');
            }    
        }catch (error) {
            console.error('Error:', error);
            alert('Failed to delete user');
        }
    });
});

