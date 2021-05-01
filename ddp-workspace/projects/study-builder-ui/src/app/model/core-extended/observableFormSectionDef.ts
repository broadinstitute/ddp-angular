import { FormSectionDef } from '../core/formSectionDef';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBlockDef } from '../core/formBlockDef';
import { SectionIcon } from '../core/sectionIcon';
import { Template } from '../core/template';

export class ObservableFormSectionDef implements FormSectionDef {
    blocksSubjects: Array<BehaviorSubject<FormBlockDef>>;
    icons: Array<SectionIcon>;
    nameTemplate: Template | null;
    sectionCode: string;

    constructor(section: FormSectionDef) {
        this.blocks = section.blocks;
        this.icons = section.icons;
        this.nameTemplate = section.nameTemplate;
        this.sectionCode = section.sectionCode;
    }

    get blocksObservables(): Array<Observable<FormBlockDef>> {
        return this.blocksSubjects.map(each => each.asObservable());
    }

    set blocks(blocks: FormBlockDef[]) {
        this.blocksSubjects = blocks.map(block => new BehaviorSubject(block));
    }

    get blocks(): FormBlockDef[] {
        return this.blocksSubjects.map(obs => obs.value);
    }

    addBlock(block: FormBlockDef): BehaviorSubject<FormBlockDef> {
        const newBlockSubject = new BehaviorSubject(block);
        this.blocksSubjects.push(newBlockSubject);
        return newBlockSubject;
    }

    deleteBlock(block: FormBlockDef): boolean {
        const i = this.blocks.indexOf(block);
        if (i >= 0) {
            this.blocksSubjects = this.blocksSubjects.splice(i);
            return true;
        }
        return false;
    }
}
