import { Grid } from '@astryxdesign/core/Grid';

// Grid caps its minimum track to the available width, including small dialogs.
const FIELD_COLUMNS = { minWidth: 240, max: 2 };

/** Paired fields reflow within the form, independently of viewport width.
 * @param {{ children: import('react').ReactNode }} props
 */
export function FormGrid({ children }) {
  return (
    <Grid columns={FIELD_COLUMNS} gap={3}>
      {children}
    </Grid>
  );
}
