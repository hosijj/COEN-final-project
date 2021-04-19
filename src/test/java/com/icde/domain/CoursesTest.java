package com.icde.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.icde.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CoursesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Courses.class);
        Courses courses1 = new Courses();
        courses1.setId("id1");
        Courses courses2 = new Courses();
        courses2.setId(courses1.getId());
        assertThat(courses1).isEqualTo(courses2);
        courses2.setId("id2");
        assertThat(courses1).isNotEqualTo(courses2);
        courses1.setId(null);
        assertThat(courses1).isNotEqualTo(courses2);
    }
}
