

    /* =========================
       DARK MODE
    ========================= */

    function toggleDarkMode() {

        document.documentElement.classList.toggle("dark");

        const btn = document.getElementById("themeBtn");

        if (document.documentElement.classList.contains("dark")) {
            btn.textContent = "â˜€ï¸";
        } else {
            btn.textContent = "ðŸŒ™";
        }

    }


    /* =========================
       CHARACTER COUNT
    ========================= */

    const jobDescription =
        document.getElementById("jobDescription");

    if (jobDescription) {

        jobDescription.addEventListener("input", function () {

            const count = this.value.length;

            const charCount =
                document.getElementById("charCount");

            if (charCount) {
                charCount.textContent =
                    count.toLocaleString() + " characters";
            }

        });

    }


    /* =========================
       GENERATE COVER LETTER
    ========================= */

    async function generateCoverLetter() {

        const name =
            document.getElementById("fullName").value.trim();

        const job =
            document.getElementById("jobTitle").value.trim();

        const company =
            document.getElementById("companyName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const jd =
            document.getElementById("jobDescription").value.trim();


        /* Required fields */

        if (!name || !job || !company) {

            alert(
                "Please enter Full Name, Target Job Title and Company Name."
            );

            return;

        }


        const btn =
            document.getElementById("generateBtn");


        /* Loading state */

        btn.disabled = true;

        btn.textContent =
            "â³ Generating with AI...";


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/generate-cover-letter",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            fullName: name,
                            jobTitle: job,
                            companyName: company,
                            email: email,
                            phone: phone,
                            location: location,
                            jobDescription: jd

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Could not generate cover letter."
                );

            }


            /* Show AI-generated letter */

            document.getElementById(
                "coverLetterPreview"
            ).textContent =
                data.coverLetter;


            /* Success */

            btn.textContent =
                "âœ… AI Cover Letter Generated";


            setTimeout(function () {

                btn.textContent =
                    "âœ¨ Generate Cover Letter";

            }, 2500);


        } catch (error) {

            console.error(
                "Cover Letter Error:",
                error
            );


            alert(
                "Could not generate cover letter. Please make sure the CareerBoost AI server is running."
            );


            btn.textContent =
                "âœ¨ Generate Cover Letter";


        } finally {

            btn.disabled = false;

        }

    }


    /* =========================
       COPY COVER LETTER
    ========================= */

    function copyCoverLetter() {

        const preview =
            document.getElementById("coverLetterPreview");

        const text =
            preview.innerText.trim();


        if (
            !text ||
            text.includes("Your cover letter will appear here")
        ) {

            alert(
                "Please generate a cover letter first."
            );

            return;

        }


        navigator.clipboard.writeText(text)

            .then(function () {

                alert(
                    "âœ… Cover letter copied successfully!"
                );

            })

            .catch(function (error) {

                console.error(
                    "Copy error:",
                    error
                );

                alert(
                    "Could not copy the cover letter."
                );

            });

    }


    /* =========================
       CLEAR FORM
    ========================= */

    function clearForm() {

        const fields = [

            "fullName",
            "jobTitle",
            "companyName",
            "email",
            "phone",
            "location",
            "jobDescription"

        ];


        fields.forEach(function (id) {

            const field =
                document.getElementById(id);

            if (field) {
                field.value = "";
            }

        });


        const charCount =
            document.getElementById("charCount");

        if (charCount) {
            charCount.textContent =
                "0 characters";
        }


        document.getElementById(
            "coverLetterPreview"
        ).innerHTML = `

            <div class="min-h-[560px] flex items-center justify-center text-center">

                <div>

                    <div class="text-6xl mb-5">
                        âœ‰ï¸
                    </div>

                    <h4 class="text-xl font-bold mb-2">
                        Your cover letter will appear here
                    </h4>

                    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                        Enter your details and click
                        <strong>Generate Cover Letter</strong>.
                    </p>

                </div>

            </div>

        `;


        const btn =
            document.getElementById("generateBtn");

        if (btn) {

            btn.disabled = false;

            btn.textContent =
                "âœ¨ Generate Cover Letter";

        }

    }


    /* =========================
       DOWNLOAD COVER LETTER
    ========================= */

    function downloadCoverLetter() {

        const preview =
            document.getElementById("coverLetterPreview");

        const text =
            preview.innerText.trim();


        if (
            !text ||
            text.includes("Your cover letter will appear here")
        ) {

            alert(
                "Please generate a cover letter first."
            );

            return;

        }


        const blob =
            new Blob(
                [text],
                {
                    type: "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "CareerBoost-AI-Cover-Letter.txt";


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(url);

    }


