// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MaterialModule } from 'src/app/external/material.module';
import { PoketypeCheckboxComponent } from './poketype-checkbox.component';

export default {
    title: 'Poketype Checkbox',
    component: PoketypeCheckboxComponent,
    argTypes: {
        pokemonType: { control: 'text' },
    },
    decorators: [
        moduleMetadata({
            declarations: [],
            imports: [MaterialModule],
        }),
    ]
} as Meta;

const Template: Story<PoketypeCheckboxComponent> = (args: PoketypeCheckboxComponent) => ({
    props: args,
});

export const Fire = Template.bind({});
Fire.args = {
    pokemonType: 'fire',
};

export const Bug = Template.bind({});
Bug.args = {
    pokemonType: 'bug',
};


