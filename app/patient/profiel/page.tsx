// app/profile/page.tsx
import styles from './page.module.css';

export default function Profile() {
  return (
    <div className={styles.body}>
      <div className={styles['profile-container']}>
        {/* Navigation Tabs */}
        <nav className={styles.navTabs}>
          <a className={`${styles.navLink} ${styles.active}`}>Profile</a>
          <a className={styles.navLink}>Billing</a>
          <a className={styles.navLink}>Security</a>
          <a className={styles.navLink}>Notifications</a>
        </nav>
        <hr className={styles.divider} />

        <div className={styles.twoColumnLayout}>
          {/* Left Column - Profile Picture */}
          <div className={styles.leftColumn}>
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>Profile Picture</div>
              <div className={styles.cardBody}>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className={styles.profileImage}
                />
                <p className={styles.imageDescription}>JPG or PNG no larger than 5 MB</p>
                <button className={styles.uploadButton}>Upload new image</button>
                <button className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          </div>

          {/* Right Column - Your Exact Form */}
          <div className={styles.rightColumn}>
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>Account Details</div>
              <div className={styles.cardBody}>
                <form className={styles['profile-form']}>
                  {/* Name and Username */}
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        defaultValue="Natalie Curtis"
                        className={styles['form-input']}
                      />
                      <small>Displayed on your public profile, notifications and other places.</small>
                    </div>
                    <div className={styles['form-group']}>
                      <label htmlFor="username">Username *</label>
                      <input
                        type="text"
                        id="username"
                        defaultValue="natalie"
                        className={styles['form-input']}
                      />
                    </div>
                  </div>

                  {/* Birthday and Gender */}
                  <div className={styles['form-group']}>
                    <label>Birthday *</label>
                    <div className={styles['birthday-inputs']}>
                      <select defaultValue="December" className={styles['form-input'] + ' ' + styles['small-input']}>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                      </select>
                      <input
                        type="number"
                        defaultValue="14"
                        className={styles['form-input'] + ' ' + styles['small-input']}
                      />
                      <input
                        type="number"
                        defaultValue="2015"
                        className={styles['form-input'] + ' ' + styles['small-input']}
                      />
                      <select defaultValue="Female" className={styles['form-input'] + ' ' + styles['small-input']}>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Email and Location */}
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label htmlFor="email">Email address *</label>
                      <input
                        type="email"
                        id="email"
                        defaultValue="natalie.curtis@gmail.com"
                        className={styles['form-input']}
                      />
                      <small>We won t share your email with anyone else.</small>
                    </div>
                    <div className={styles['form-group']}>
                      <label htmlFor="location">Location *</label>
                      <input
                        type="text"
                        id="location"
                        defaultValue="London, England"
                        className={`${styles['form-input']} ${styles['highlighted']}`}
                      />
                    </div>
                  </div>

                  {/* Organization and Website */}
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label htmlFor="organization">Organization *</label>
                      <input
                        type="text"
                        id="organization"
                        defaultValue="Pixel Ltd."
                        className={styles['form-input']}
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label htmlFor="website">Website *</label>
                      <input
                        type="url"
                        id="website"
                        defaultValue="https://www.htmlstream.com/natalie"
                        className={styles['form-input']}
                      />
                      <small>https://www.htmlstream.com/natalie</small>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className={styles['form-group']}>
                    <label htmlFor="phone">Phone number</label>
                    <div className={styles['phone-input']}>
                      <select defaultValue="+44" className={styles['form-input'] + ' ' + styles['small-input']}>
                        <option>+44</option>
                        <option>+1</option>
                        <option>+91</option>
                      </select>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue="(018) 347 8804"
                        className={styles['form-input'] + ' ' + styles['phone-number-input']}
                      />
                    </div>
                    <button type="button" className={styles['add-phone-button']}>
                      + Add phone number
                    </button>
                  </div>

                  {/* Preferred Language */}
                  <div className={styles['form-group']}>
                    <label htmlFor="language">Preferred language *</label>
                    <select id="language" defaultValue="English" className={styles['form-input']}>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <button type="submit" className={styles.saveButton}>
                    Save changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}