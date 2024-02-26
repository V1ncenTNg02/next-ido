import Link from 'next/link'
import React from 'react'

import styles from './PreviewAlert.module.css'

interface Props {}

const PreviewAlert: React.FC<Props> = () => (
  <div className={styles.previewAlert}>
    This is page is in preview mode&nbsp;
    <Link href='/api/exit-preview' className={styles.previewLink}>
      [EXIT]
    </Link>
  </div>
)

export default PreviewAlert
