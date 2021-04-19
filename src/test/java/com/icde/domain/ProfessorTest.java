package com.icde.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.icde.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfessorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Professor.class);
        Professor professor1 = new Professor();
        professor1.setId("id1");
        Professor professor2 = new Professor();
        professor2.setId(professor1.getId());
        assertThat(professor1).isEqualTo(professor2);
        professor2.setId("id2");
        assertThat(professor1).isNotEqualTo(professor2);
        professor1.setId(null);
        assertThat(professor1).isNotEqualTo(professor2);
    }
}
