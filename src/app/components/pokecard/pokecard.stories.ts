// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MaterialModule } from 'src/app/external/material.module';
import { PokecardComponent } from './pokecard.component';

export default {
    title: 'Pokecard',
    component: PokecardComponent,
    argTypes: {
        pokemonName: { control: 'text' },
    },
    decorators: [
        moduleMetadata({
            declarations: [],
            imports: [MaterialModule],
        }),
    ]
} as Meta;

const Template: Story<PokecardComponent> = (args: PokecardComponent) => ({
    props: args,
});

export const Pikachu = Template.bind({});
Pikachu.args = {
    pokemonName: 'pikachu',
};


