document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openModalBtn");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    document.getElementById('createPostForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('/activity', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Post created successfully');
                modal.style.display = "none";
                form.reset(); // Reset the form fields
            } else {
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create post');
        }
    });

});

