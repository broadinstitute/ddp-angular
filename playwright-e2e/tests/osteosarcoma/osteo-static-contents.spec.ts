import { test } from 'fixtures/osteo-fixture';

test('Osteo Static Content @osteo', async ({ page }) => {
  await page
    .getByRole('heading', {
      name: 'Together, the osteosarcoma community has the power to move research forward'
    })
    .click();
  await page.getByText('By generating the most comprehensive osteosarcoma database, we can accelerate re').click();
  await page.getByRole('heading', { name: 'You can help drive discoveries' }).click();
  await page.getByRole('img', { name: 'Clipboard' }).click();
  await page.getByText('Share your experiences, access to medical records, and samples.').click();
  await page.getByText('The anonymous study data is shared widely with the biomedical community so all m').click();
  await page.getByRole('img', { name: 'Microscope' }).click();
  await page.getByRole('img', { name: 'Heart' }).click();
  await page.getByText('This will accelerate the ability of researchers to make discoveries.').click();
  await page.getByRole('img', { name: 'People' }).click();
  await page.getByText('In some cases, we may be able to share learnings from the genomic sequencing of ').click();
  await page.getByText('If you or your child have ever been diagnosed with osteosarcoma').click();
  await page.getByText('You can make an impact by telling us about your or your child’s cancer. Share ex').click();
  await page.getByText('If your child has passed away from osteosarcoma').click();
  await page.getByText('You can make an impact by answering questions about your child’s diagnosis and e').click();
  await page.getByRole('heading', { name: 'Participating is easy' }).click();
  await page.getByText('You can choose to allow the study team to:').click();
  await page.getByText('You may also opt-in to:').click();
  await page.getByRole('heading', { name: 'Behind the scenes' }).click();
  await page.getByRole('heading', { name: 'Touring the Genomics Platform' }).click();
  await page.getByText('Members of the Count Me In Team and the OSP Project Advisory Council tour the Ge').click();

  await page.getByRole('main').getByRole('button', { name: 'Join Mailing List button' }).click();
  await page.getByRole('button').filter({ hasText: 'clear' }).click();
  await page.getByRole('banner').getByRole('link', { name: 'For Your Physician' }).click();
  await page.getByRole('heading', { name: 'For your physician' }).click();
  await page.getByText('The purpose of this page is to provide details about the Osteosarcoma Project to').click();

  await page.getByText('The Osteosarcoma Project (OSproject) is part of Count Me In, a nonprofit organiz').click();
  await page.getByRole('banner').getByRole('link', { name: 'Scientific Impact' }).click();
  await page.getByRole('heading', { name: 'Goals' }).click();
  await page.getByText('The goal of the OSproject is to transform cancer care by enabling all patients w').click();
  await page.getByRole('heading', { name: 'How We Collect Data' }).click();
  await page.getByText('• Surveys: All participants in the OSproject will be able to provide patient-rep').click();
  await page.getByText('• Interviews or focus groups: Some participants will also be contacted to partic').click();
  await page.getByRole('heading', { name: 'Elements of Data that we Release' }).click();
  await page.getByText('Thanks to the participation and contributions of patients enrolled in the OSproj').click();
  await page.getByText('• Medical Record Information: Information about diagnosis and treatment will be ').click();
  await page.getByRole('banner').getByRole('link', { name: 'Participation' }).click();
  await page.getByRole('heading', { name: 'Here’s how to participate' }).click();
  await page.getByText('STEP 1 access_time10-15 minutes Provide consent for the study The consent form i').click();
  await page.getByRole('heading', { name: 'Provide consent for the study' }).click();
  await page.getByText('The consent form is how participants give researchers their permission to take p').click();
  await page.getByRole('heading', { name: 'Tell us where you’ve been treated' }).click();
  await page.getByText('We ask where patients have been treated for their cancer, so that we can request').click();
  await page
    .locator('section')
    .filter({
      hasText: 'STEP 2 access_time5 minutes Tell us where you’ve been treated We ask where patie'
    })
    .getByRole('img', { name: 'Computer screen displaying medical center' })
    .click();
  await page
    .locator('section')
    .filter({
      hasText: 'STEP 3 access_timeTime varies by survey Respond to surveys about you and your ex'
    })
    .getByRole('img', { name: 'Computer screen displaying online survey' })
    .click();
  await page
    .getByRole('heading', {
      name: 'Respond to surveys about you and your experience with cancer'
    })
    .click();
  await page.getByText('In these surveys we ask questions about a participant’s experience with osteosar').click();
  await page.getByRole('banner').getByRole('link', { name: 'FAQs' }).click();
  await page.getByText('As part of the OSproject, patients contribute their experiences, clinical inform').click();
  await page.getByRole('heading', { name: 'Frequently Asked Questions' }).click();
  await page.getByText('This project has been built with the guidance and input of many different member').click();
  await page.getByRole('button', { name: 'What is the goal of the OSproject?' }).click();
  await page.getByText('The goal of the OSproject is to transform cancer care by enabling all patients w').click();
  await page.getByRole('button', { name: 'What does participation look like?' }).click();
  await page.getByText('Participants can join through the project website to share their information and').click();
  await page.getByText('• Provide consent: The consent form is how participants give researchers their p').click();
  await page
    .getByRole('button', {
      name: 'Are there any benefits that participants receive for participating?'
    })
    .click();
  await page.getByText('While there are no explicit benefits that individuals receive for enrolling in t').click();
  await page
    .getByRole('paragraph')
    .filter({
      hasText: '• Receive information about what we’ve learned from your tumor sample (optional)'
    })
    .click();
  await page.getByText('• Learn more about your normal DNA (optional): The project is also partnering wi').click();
  await page.getByRole('banner').getByRole('link', { name: 'About Us' }).click();
  await page.getByRole('heading', { name: 'About Us' }).click();
  await page.getByText('is stewarded by the Broad Institute of MIT and Harvard, the Dana-Farber Cancer I').click();
  await page.getByText("Count Me In's Osteosarcoma (OS) Project is supported by a grant from the Nationa").click();
  await page.getByText('The Osteosarcoma Project has been designed and implemented collaboratively with ').click();
  await page.getByRole('heading', { name: 'Project Advisory Council' }).click();
  await page.getByText('Theresa Beech is the mother of two kids, Daniel and Sara. When Daniel was 11, he').click();
  await page.getByRole('img', { name: 'Theresa Beech photo' }).click();
  await page.getByRole('img', { name: 'Ann Graham photo' }).click();
  await page.getByText('Ann is the founder and President of MIB Agents Osteosarcoma Alliance. At age 43,').click();
  await page.getByRole('heading', { name: 'Ann Graham' }).click();
  await page.getByText('Alexis Johnson is a 12-year Osteosarcoma Cancer survivor and an amputee. During ').click();
  await page.getByRole('img', { name: 'Alexis Johnson photo' }).click();
  await page.getByRole('img', { name: 'Ryan Kennington photo' }).click();
  await page.getByRole('heading', { name: 'Ryan Kennington' }).click();
  await page.getByText('At the age of 17 years old, Ryan was diagnosed with Osteosarcoma in the femoral ').click();
  await page.getByText('Ben Moody is the father of Claire, who was diagnosed with osteosarcoma in 2012 a').click();
  await page.getByRole('heading', { name: 'Ben Moody' }).click();
  await page.getByRole('img', { name: 'Ben Moody photo' }).click();
  await page.getByRole('img', { name: 'Laura Sobeich photo' }).click();
  await page.getByRole('heading', { name: 'Laura Sobeich' }).click();
  await page.getByText('Laura Sobiech’s son, Zach, died from osteosarcoma at the age of 18. In the last ').click();
  await page.getByRole('img', { name: 'Katherine Janeway photo' }).click();
  await page.getByRole('img', { name: 'Alejandro Sweet-Cordero photo' }).click();
  await page.getByRole('img', { name: 'David Malkin photo' }).click();
  await page.getByRole('img', { name: 'Nathalie Gaspar photo' }).click();
  await page.getByRole('img', { name: 'Richard Gorlick photo' }).click();
  await page.getByRole('img', { name: 'Brian Crompton photo' }).first().click();
  await page.getByRole('heading', { name: 'Learn more about the Osteosarcoma Project' }).click();
});
