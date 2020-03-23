// import { Observable } from 'rxjs/Rx';
// import { AboutUsDialogsComponent } from './about-us-dialogs/about-us-dialogs.component';
// import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
// import { Injectable } from '@angular/core';

// @Injectable()
// export class AboutUsService {

//   ourTeam: any[];

//   constructor(private dialog: MdDialog) {
//     this.initTeam();
//   }

//   public showDetails(id: number): Observable<boolean> {

//     let dialogRef: MdDialogRef<AboutUsDialogsComponent>;

//     dialogRef = this.dialog.open(AboutUsDialogsComponent);
//     dialogRef.componentInstance.id = this.ourTeam[id].id;
//     dialogRef.componentInstance.name = this.ourTeam[id].name;
//     dialogRef.componentInstance.role = this.ourTeam[id].role;
//     dialogRef.componentInstance.imageUrl = this.ourTeam[id].url;
//     dialogRef.componentInstance.bio = this.ourTeam[id].bio;

//     return dialogRef.afterClosed();
//   }

//   initTeam() {
//     this.ourTeam = [];

//     this.ourTeam =
//       [
//         {
//           "id": 0,
//           "name": "Daniel MacArthur, PhD",
//           "role": "Principal Investigator",
//           "url": "/assets/images/member-daniel-mac-arthur.jpg",
//           "bio": "Daniel is a Principal Investigator on the Rare Genomes Project and the Co-Director for the Broad Center for Mendelian Genomics. He is also a group leader within the Analytic and Translational Genetics Unit (ATGU) at Massachusetts General Hospital, Assistant Professor at Harvard Medical School and the Associate Director of Medical and Population Genetics at the Broad Institute. He is a strong advocate and pioneer of open science and data sharing. He lead the creation and release of the Exome Aggregation Consortium (ExAC) and Genome Aggregation Database (gnomAD)."
//         },
//         {
//           "id": 1,
//           "name": "Heidi Rehm, PhD, FACMG",
//           "role": "Principal Investigator",
//           "url": "/assets/images/member-heidi-rehm.jpg",
//           "bio": "Heidi is a Principal Investigator on the Rare Genomes Project and is the Co-Director for the Broad Center for Mendelian Genomics. She is also the Chief Genomics Officer in the Department of Medicine at Massachusetts General Hospital and a Professor at Harvard Medical School. She built and until 2018 directed the  Laboratory for Molecular Medicine at Partners Healthcare Personalized Medicine. She is a strong advocate and pioneer of open science and data sharing, through leadership roles in ClinGen and the Global Alliance for Genomics and Health."
//         },
//         {
//           "id": 2,
//           "name": "Anne O’Donnell-Luria, MD, PhD",
//           "role": "Medical Director",
//           "url": "/assets/images/member-anne-odonnell.jpg",
//           "bio": "Anne is the Medical Director on the Rare Genomes Project. She is the Associate Director for Rare Disease Genomics at the Broad Institute. She obtained her MD/PhD from Columbia University and is a board-certified Clinical Genetics and Metabolism physician and pediatrician who sees patients at Boston Children's Hospital. She is an Instructor at Harvard Medical School."
//         },
//         {
//           "id": 3,
//           "name": "Melanie O'Leary, MS, LGC",
//           "role": "Operations Lead",
//           "bio": "Melanie is the Operations Lead for the Rare Genomes Project and a Senior Clinical Project Manager at the Broad Institute. She oversees the operational aspects of the project and will lead the return of results to families enrolled in the study. She is a licensed, board-certified Genetic Counselor who has worked in a variety of clinical, research, and clinical laboratory settings."
//         },
//         {
//           "id": 4,
//           "name": "Harindra Arachchi, MBA",
//           "role": "Software Engineer",
//           "url": "/assets/images/member-harindra-arachchi.jpg",
//           "bio": "Harindra is a Software Engineer working on building tools to help study rare genetic diseases, including Matchbox, which is used to match families around the world who have pathogenic variants in the same genes."
//         },
//         {
//           "id": 5,
//           "name": "Samantha Baxter, MS, LGC",
//           "role": "Senior Clinical Genomics Specialist",
//           "url": "/assets/images/member-samantha-baxter.jpg",
//           "bio": "Samantha is a licensed, board-certified Genetic Counselor for the Rare Genomes Project and Senior Clinical Genomics Specialist at the Broad Institute. She has worked in the area of cardiovascular and laboratory genetics and is interested in data sharing, particularly in improving methods for effectively sharing phenotype information."
//         },
//         {
//           "id": 6,
//           "name": "Jaime Chang",
//           "role": "Senior Project Coordinator",
//           "url": "/assets/images/member-jaime-chang.jpg",
//           "bio": "Jaime is a Senior Project Coordinator for the Rare Genomes Project. She was previously a laboratory research associate and also has prior marketing experience in healthcare and biotech."
//         },
//         {
//           "id": 7,
//           "name": "Katherine Chao",
//           "role": "Genomic Variant Analyst",
//           "url": "/assets/images/member-katherine-chao.jpg",
//           "bio": "Katherine is a Genomic Variant Analyst conducting exome and genome analyses for families with rare disease. Before joining the Broad, she worked in the NIH’s Undiagnosed Diseases Program."
//         },
//         {
//           "id": 8,
//           "name": "Beryl Cummings",
//           "role": "Genomic Analyst",
//           "url": "/assets/images/member-beryl-cummings.jpg",
//           "bio": "Beryl is a Genomic Analyst and Graduate Student from the Biomedical and Biological Sciences Program at Harvard who works on using RNA sequencing data to interpret the functional impact of human genetic variation."
//         },
//         {
//           "id": 9,
//           "name": "Eleina England, MS",
//           "role": "Genomic Variant Analyst",
//           "url": "/assets/images/member-eleina-england.jpg",
//           "bio": "Eleina is a Genomic Variant Analyst who performs exome and genome analyses for families with rare disease. She has a masters in biology, and before joining the Broad, she worked in research and diagnostic laboratory settings."
//         },
//         {
//           "id": 10,
//           "name": "Julia Goodrich, PhD",
//           "role": "Genomic Analyst",
//           "url": "/assets/images/member-julia-goodrich.jpg",
//           "bio": "Julia is a Genomic Analyst and Postdoctoral Fellow interested in developing methods to improve the diagnosis of rare genetic diseases. She is currently focused on detecting structural variants that cause rare disease."
//         },
//         {
//           "id": 11,
//           "name": "Monica Hsiung Wojcik, MD",
//           "role": "Clinical Genomic Analyst",
//           "url": "/assets/images/member-monica-wojcik.jpg",
//           "bio": "Monica is Clinical Genomic Analyst and a board-certified pediatrics physician who is now completing her combined fellowship training in genetics and neonatology through Boston Children's Hospital and Harvard Medical School. She is currently focused on gene discovery and improving genetic diagnostic rates, particularly in the neonatal population. She has an MD from Harvard Medical School."
//         },
//         {
//           "id": 12,
//           "name": "Kristen Laricchia, MS",
//           "role": "Associate Computational Biologist",
//           "url": "/assets/images/member-kristen-laricchia.jpg",
//           "bio": "Kristen is an Associate Computational Biologist who works on methods to identify variants in the mitochondrial genome to improve rare disease diagnosis."
//         },
//         {
//           "id": 13,
//           "name": "Monkol Lek, PhD",
//           "role": "Computational Biologist",
//           "url": "/assets/images/member-monkol-lek.jpg",
//           "bio": "Monkol is an Assistant Professor of Genetics at Yale School of Medicine with affiliation at the Broad Institute. His group focuses on the development of computational methods for the analysis of genomic data from families with rare disease, particularly those with limb girdle muscular dystrophy."
//         },
//         {
//           "id": 14,
//           "name": "Alysia Lovgren, PhD",
//           "role": "Analysis Lead",
//           "url": "/assets/images/member-alysia-lovgren.jpg",
//           "bio": "Alysia leads the Analysis team for the Rare Genomes Project and is a Clinical Genomic Variant Scientist. Prior to joining the Broad, Alysia performed variant interpretation in the whole exome sequencing group at GeneDx."
//         },
//         {
//           "id": 15,
//           "name": "Lauren Margolin",
//           "role": "Senior Project Manager",
//           "url": "/assets/images/member-lauren-margolin.jpg",
//           "bio": "Lauren is a Senior Project Manager at the Broad Institute. She is focused on building partnerships with patient advocacy groups to identify resources and connections to support the families who participate in the Rare Genomes Project."
//         },
//         {
//           "id": 16,
//           "name": "Lynn Pais, MS",
//           "role": "Genomic Variant Analyst",
//           "url": "/assets/images/member-lynn-pais.jpg",
//           "bio": "Lynn is a Genomic Variant Analyst who performs exome and genome analyses for families with rare disease. She has a master’s degree in human genetics and previously worked as a project manager for a genetic research study at Brigham and Women’s Hospital."
//         },
//         {
//           "id": 17,
//           "name": "Hana Snow",
//           "role": "Software Engineer",
//           "url": "/assets/images/member-hana-snow.jpg",
//           "bio": "Hana is a Software Engineer working on building tools to facilitate rare disease research. She is the lead developer for our rare disease analysis platform (seqr)."
//         },
//         {
//           "id": 18,
//           "name": "Matthew Solomonson, PhD",
//           "role": "Senior Software Engineer",
//           "url": "/assets/images/member-matthew-solomonson.jpg",
//           "bio": "Matt leads a software development team at the Broad. He is a Software Engineer interested in developing interactive visualization tools for exploring large biological datasets. He studied protein structural biology during his PhD at the University of British Columbia."
//         },
//         {
//           "id": 19,
//           "name": "Miriam Udler, MD, PhD",
//           "role": "Clinical Genomic Analyst",
//           "url": "/assets/images/member-miriam-udler.jpg",
//           "bio": "Miriam is Clinical Analyst and also a board-certified internal medicine and endocrinology physician who sees patients at Massachusetts General Hospital with a special focus on clinical endocrine genetics. She holds a PhD in Genetic Epidemiology from University of Cambridge."
//         },
//         {
//           "id": 20,
//           "name": "Zaheer Valivullah",
//           "role": "Genomic Variant Analyst",
//           "bio": "Zaheer is a Genomic Variant Analyst conducting exome and genome analyses for families with rare disease. Before joining the Broad, he worked in the NIH’s Undiagnosed Diseases Program."
//         },
//         {
//           "id": 21,
//           "name": "Grace VanNoy, MS, LGC",
//           "role": "Clinical Project Manager",
//           "url": "/assets/images/member-grace-van-noy.jpg",
//           "bio": "Grace is a Clinical Project Manager for the Rare Genomes Project. She is a licensed, board-certified Genetic Counselor with a background in pediatric rare disease, gene discovery, and genomic sequencing."
//         },
//         {
//           "id": 22,
//           "name": "Qingbo Wang",
//           "role": "Genomic Analyst",
//           "url": "/assets/images/member-qingbo-wang.jpg",
//           "bio": "Qingbo is a Genomic Analyst and Graduate Student from the Bioinformatics and Integrative Genomics PhD program at Harvard. He works on identifying multinucleotide variants, an important class of variants that are missed by standard calling pipelines."
//         },
//         {
//           "id": 23,
//           "name": "Ben Weisburd",
//           "role": "Software Engineer",
//           "url": "/assets/images/member-ben-weisburd.jpg",
//           "bio": "Ben is a Software Engineer working on developing methods for interpreting DNA sequencing data in the context of severe Mendelian diseases. He developed our rare disease analysis platform (seqr)."
//         },
//         {
//           "id": 24,
//           "name": "Clara Williamson",
//           "role": "Clinical Project Coordinator",
//           "url": "/assets/images/member-clara-williamson.jpg",
//           "bio": "Clara is Clinical Project Coordinator for the Rare Genomes Project. She has a history in genetic disease research and is working on building out tools for patient outreach and communication. She is working at the Broad while applying to medical school."
//         },
//         {
//           "id": 25,
//           "name": "Mike Wilson",
//           "role": "Associate Computational Biologist",
//           "url": "/assets/images/member-mike-wilson.jpg",
//           "bio": "Mike is an Associate Computational Biologist working on the preliminary analyses of exomes and genomes to identify causal candidate genes and variants. He processes and quality checks the data that is generated for analysis."
//         },
//         {
//           "id": 26,
//           "name": "Eric Liao, MD, PhD",
//           "role": "Collaborator",
//           "url": "/assets/images/member-eric-liao.jpg",
//           "bio": "Dr. Liao is a plastic and reconstructive surgeon at Massachusetts General Hospital who is spearheading the Rare Genomes Project's craniofacial initiative. He is an assistant professor of surgery at Harvard Medical School, the director of the Cleft and Craniofacial Center at Massachusetts General Hospital, and the principal investigator at the Center for Regenerative Medicine at the Harvard Stem Cell Institute."
//         }
//       ];
//   }
// }
